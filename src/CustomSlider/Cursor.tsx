import * as React from 'react';

// ui
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
// animation
const {
  Value,
  event,
  cond,
  eq,
  set,
  add,
  Clock,
  divide,
  diff,
  lessThan,
  abs,
  multiply,
  block,
  startClock,
  stopClock,
  clockRunning,
  and,
  greaterOrEq,
  call,
  sub
} = Animated;
const ANIMATOR_PAUSE_ZERO_VELOCITY = 1;
const ANIMATOR_PAUSE_CONSECUTIVE_FRAMES = 10;
const DEFAULT_SNAP_TENSION = 300;
const DEFAULT_SNAP_DAMPING = 0.7;
interface SnapPoint {
  x?: number;
  y?: number;
  damping?: number;
  tension?: number;
  id?: string;
}
interface Boundaries {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  bounce?: number;
}
interface CursorProps {
  x: typeof Value;
  count: number;
  size: number;
  initialPosition?: {
    x: number;
    y: number;
  };
  dragEnabled?: boolean;
  onDrag?: any;
  boundaries?: Boundaries;
  verticalOnly?: boolean;
  horizontalOnly?: boolean;
  onStop?: any;
  onSnap?: any;
  snapPoints: SnapPoint[];
  dragToss: number;
}

function withLimits(value, lowerBound, upperBound) {
  let result = value;
  if (lowerBound !== undefined) {
    result = cond(lessThan(value, lowerBound), lowerBound, result);
  }
  if (upperBound !== undefined) {
    result = cond(lessThan(upperBound, value), upperBound, result);
  }
  return result;
}
function sq(x: any) {
  return multiply(x, x);
}
function snapTo(
  target: any,
  snapPoints: any,
  best: any,
  clb: any,
  dragClb: any
) {
  const dist = new Value(0);
  const snap = (pt: any) => [
    set(best.tension, pt.tension || DEFAULT_SNAP_TENSION),
    set(best.damping, pt.damping || DEFAULT_SNAP_DAMPING),
    set(best.x, pt.x || 0),
    set(best.y, pt.y || 0)
  ];
  const snapDist = (pt: any) =>
    add(sq(sub(target.x, pt.x || 0)), sq(sub(target.y, pt.y || 0)));
  return [
    set(dist, snapDist(snapPoints[0])),
    ...snap(snapPoints[0]),
    ...snapPoints.map((pt: any) => {
      const newDist = snapDist(pt);
      return cond(lessThan(newDist, dist), [set(dist, newDist), ...snap(pt)]);
    }),
    (clb || dragClb) &&
      call([best.x, best.y, target.x, target.y], ([bx, by, x, y]) => {
        snapPoints.forEach((pt: any, index: number) => {
          if (
            (pt.x === undefined || pt.x === bx) &&
            (pt.y === undefined || pt.y === by)
          ) {
            if (clb) {
              clb({ nativeEvent: { ...pt, index } });
            }
            if (dragClb) {
              dragClb({
                nativeEvent: {
                  x,
                  y,
                  targetSnapPointId: pt.id,
                  state: 'end'
                }
              });
            }
          }
        });
      })
  ];
}
class Cursor extends React.Component<CursorProps, any> {
  handleEvent: any;
  transX: any;
  transY: any;
  static defaultProps = {
    dragToss: 0.1,
    dragEnabled: true,
    initialPosition: { x: 0, y: 0 }
  };
  constructor(props: CursorProps) {
    super(props);
    const gesture = {
      x: new Value(0),
      y: new Value(0)
    };
    const state = new Value(-1);

    const target = {
      x: new Value(this.props.initialPosition.x || 0),
      y: new Value(this.props.initialPosition.y || 0)
    };
    const obj = {
      vx: new Value(0),
      vy: new Value(0),
      mass: 1
    };
    const clock = new Clock();
    const dt = divide(diff(clock), 1000);
    const dragAnchor = { x: new Value(0), y: new Value(0) };

    this.handleEvent = event([
      {
        nativeEvent: {
          translationX: gesture.x,
          translationY: gesture.y,
          state
        }
      }
    ]);
    const noMovementFrames = {
      x: new Value(
        this.props.verticalOnly ? ANIMATOR_PAUSE_CONSECUTIVE_FRAMES + 1 : 0
      ),
      y: new Value(
        this.props.horizontalOnly ? ANIMATOR_PAUSE_CONSECUTIVE_FRAMES + 1 : 0
      )
    };
    const handleStartDrag =
      this.props.onDrag &&
      call([target.x, target.y], ([x, y]) =>
        this.props.onDrag({ nativeEvent: { x, y, state: 'start' } })
      );

    // what does this code do?
    const dragBuckets: [any[], any[], any[]] = [[], [], []];
    const snapBuckets: [any[], any[], any[]] = [[], [], []];
    const permBuckets: [any[], any[], any[]] = [[], [], []];

    const sortBuckets = (specialBuckets: any) => ({
      x: specialBuckets
        .map((b: any, idx: number) =>
          [...permBuckets[idx], ...b].reverse().map(b1 => b1.x)
        )
        .reduce((acc: any, b2: any) => acc.concat(b2), []),
      y: specialBuckets
        .map((b: any, idx: number) =>
          [...permBuckets[idx], ...b].reverse().map(b1 => b1.y)
        )
        .reduce((acc: any, b2: any) => acc.concat(b2), [])
    });
    const dragBehaviors = sortBuckets(dragBuckets);
    const snapBehaviors = sortBuckets(snapBuckets);
    //

    const stopWhenNeeded = cond(
      and(
        greaterOrEq(noMovementFrames.x, ANIMATOR_PAUSE_CONSECUTIVE_FRAMES),
        greaterOrEq(noMovementFrames.y, ANIMATOR_PAUSE_CONSECUTIVE_FRAMES)
      ),
      block([
        props.onStop
          ? cond(
              clockRunning(clock),
              call(
                [target.x, target.y],
                ([x, y]) =>
                  props.onStop && props.onStop({ nativeEvent: { x, y } })
              )
            )
          : [],
        stopClock(clock)
      ]),
      startClock(clock)
    );
    const tossedTarget = {
      x: add(target.x, multiply(props.dragToss, obj.vx)),
      y: add(target.y, multiply(props.dragToss, obj.vy))
    };
    const snapAnchor = {
      x: new Value(props.initialPosition.x || 0),
      y: new Value(props.initialPosition.y || 0),
      tension: new Value(DEFAULT_SNAP_TENSION),
      damping: new Value(DEFAULT_SNAP_DAMPING)
    };
    const updateSnapTo = snapTo(
      tossedTarget,
      props.snapPoints,
      snapAnchor,
      props.onSnap,
      props.onDrag
    );
    const transition = (
      axis: 'x' | 'y',
      vaxis: 'vx' | 'vy',
      lowerBound: 'top' | 'left' | 'right' | 'bottom',
      upperBound: 'top' | 'left' | 'right' | 'bottom'
    ) => {
      const dragging = new Value(0);
      const start = new Value(0);
      const x = target[axis];
      const vx = obj[vaxis];
      const anchor = dragAnchor[axis];
      const drag = gesture[axis];
      let advance = cond(
        lessThan(abs(vx), ANIMATOR_PAUSE_ZERO_VELOCITY),
        x,
        add(x, multiply(vx, dt))
      );
      if (this.props.boundaries) {
        advance = withLimits(
          advance,
          this.props.boundaries[lowerBound],
          this.props.boundaries[upperBound]
        );
      }
      const last = new Value(Number.MAX_SAFE_INTEGER);
      const noMoveFrameCount = noMovementFrames[axis];
      const testMovementFrames = cond(
        eq(advance, last),
        set(noMoveFrameCount, add(noMoveFrameCount, 1)),
        [set(last, advance), set(noMoveFrameCount, 0)]
      );
      const step = cond(
        eq(state, State.ACTIVE),
        [
          cond(
            dragging,
            0,
            block([
              handleStartDrag || [],
              startClock(clock),
              set(dragging, 1),
              set(start, x)
            ])
          ),
          set(anchor, add(start, drag)),
          cond(dt, dragBehaviors[axis])
        ],
        [
          cond(clockRunning(clock), 0, startClock(clock)),
          cond(dragging, [updateSnapTo, set(dragging, 0)]),
          cond(dt, snapBehaviors[axis]),
          testMovementFrames,
          stopWhenNeeded
        ]
      );
    };
    this.transX = transition('x', 'vx', 'left', 'right');
    this.transY = transition('y', 'vy', 'top', 'bottom');
  }
  public render() {
    const { size, count, dragEnabled: enabled } = this.props;
    const { handleEvent } = this;

    return (
      <PanGestureHandler
        onHandlerStateChange={handleEvent}
        maxPointers={1}
        {...{ handleEvent, enabled }}
      >
        <Animated.View
          style={[
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: 'white'
            },
            {
              transform: [
                {
                  translateX: this.transX,
                  translateY: this.transY
                }
              ]
            }
          ]}
        />
      </PanGestureHandler>
    );
  }
}
const styles = StyleSheet.create({});
export { Cursor };
