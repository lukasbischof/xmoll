import Game from "../Game";

type TileState = "success" | "failure" | "unknown";

interface Props {
    answerCount: number;
}

export default function ProgressBar({ answerCount }: Props) {
    const game = Game.currentGame;
    if (!game || answerCount === 0) return null;

    const { playedIntervals, answeredIntervals, config } = game.state;
    const gridColumns = Number.isFinite(config.rounds)
        ? `repeat(${config.rounds}, 1fr)`
        : "repeat(auto-fit, minmax(1px, 1fr))";

    return (
        <div class="progress-bar" style={{ gridTemplateColumns: gridColumns }}>
            {answeredIntervals.map((answer, i) => {
                const state: TileState = config.examMode
                    ? "unknown"
                    : answer === playedIntervals[i].distance
                      ? "success"
                      : "failure";
                return (
                    <div
                        key={`${i}-${playedIntervals[i].lower.index}-${playedIntervals[i].upper.index}`}
                        class={`tile ${state}`}
                    />
                );
            })}
        </div>
    );
}
