import React, { MouseEventHandler } from "react";

type TabsProps = {
  setSource: (source: "BD09" | "GCJ02") => void;
  targetRef: React.MutableRefObject<"BD09" | "GCJ02">;
  setParseLngLatList: (list: number[][]) => void;
};

export default function Tabs(props: TabsProps) {
  const handleChangeTab: MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLAnchorElement;
    const tabs = document.querySelectorAll("a.tab");
    tabs.forEach((tab) => {
      tab.classList.remove("tab-active");
    });
    target.classList.add("tab-active");

    const dataType = target.getAttribute("data-type")?.split(",");
    props.setSource(dataType?.[0] as "BD09" | "GCJ02");
    props.targetRef.current = dataType?.[1] as "BD09" | "GCJ02";
    props.setParseLngLatList([]);
  };

  return (
    <div className="tabs tabs-boxed my-4" onClick={handleChangeTab}>
      <a className="tab tab-active" data-type="BD09,GCJ02">
        百度转高德
      </a>
      <a className="tab" data-type="GCJ02,BD09">
        高德转百度
      </a>
    </div>
  );
}
