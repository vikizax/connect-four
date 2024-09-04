export const Column = ({
  entries,
  onClick,
}: {
  entries: (number | null)[];
  onClick: () => void;
}) => {
  return (
    <>
      <div className="column" onClick={onClick}>
        {entries.map((row, idx) => {
          return (
            <div className="tile" key={idx}>
              {row !== null && <div className={`player player-${row}`}></div>}
            </div>
          );
        })}
      </div>
    </>
  );
};
