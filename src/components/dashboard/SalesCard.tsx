export type SalesProps = {
  name: string;
  email: string;
  salesAmount: string;
};

export default function SalesCard(props: SalesProps) {
  return (
    <div className="flex flex-wrap justify-between gap-3">
      <section className="flex justify-between gap-3">
        <div className="text-sm">
          <p>{props.name}</p>
          <div className="text-ellipsis overflow-hidden whitespace-nowrap w-[120px] sm:w-auto text-gray-400">
            {props.email}
          </div>
        </div>
      </section>
      <p>{props.salesAmount}</p>
    </div>
  );
}
