import { cn } from "@/lib/utils";

type Props = {
  openMenu: boolean;
  headings: Array<string>;
};

export default function Headings(props: Props) {
  let currentId = 0;

  const getId = () => {
    currentId += 1;
    return currentId;
  };

  if (props.headings.length <= 1) {
    return <></>;
  }
  return (
    <ul
      className={cn(
        "fixed left-0 top-[50px] z-[100] h-[100vh] w-[50vw] overflow-y-auto rounded-md bg-slate-800 px-3 py-2 text-slate-400 transition-transform duration-200 md:sticky md:left-2 md:top-10 md:mx-2 md:mr-2 md:inline-flex md:h-fit md:max-h-[70vh] md:w-[15vw] md:flex-col md:justify-start md:bg-[rgba(250,250,250,0.65)] md:p-2 md:text-inherit md:text-slate-600 md:dark:bg-[rgba(50,50,50,0.65)]",
        {
          " translate-x-0": props.openMenu,
          " -translate-x-[80vw] md:translate-x-0": !props.openMenu,
        },
      )}
    >
      {props.headings.map((h) => {
        return (
          <li
            key={h}
            className="my-4 w-fit text-lg underline-offset-2 hover:underline dark:text-slate-300 md:my-2 md:text-sm"
          >
            <p
              className={`${getId()} cursor-pointer`}
              onClick={(e) => {
                const id = e.currentTarget.classList[0];
                const heading = document.getElementById(id);
                if (heading != null) {
                  heading.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            >
              {h}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
