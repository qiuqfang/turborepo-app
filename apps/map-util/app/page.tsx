"use client";

import { MouseEventHandler, useRef, useState } from "react";

import { FixedSizeList as List } from "react-window";
import { getCoordinate } from "@/util";

export default function Home() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [parseLngLatList, setParseLngLatList] = useState<number[][]>([]);
  const [source, setSource] = useState<"BD09" | "GCJ02">("BD09");
  const targetRef = useRef<"BD09" | "GCJ02">("GCJ02")

  const [errorType, setErrorType] = useState<string[]>([]);

  const handleConversion = () => {
    const value = textareaRef.current!.value;
    if (!value) {
      setErrorType(["noValue", "请输入需要转换的经纬度"]);
      setTimeout(() => {
        setErrorType(["", "请输入需要转换的经纬度"]);
      }, 2000);
      return;
    }

    if (value.indexOf("，") !== -1) {
      setErrorType([
        "formatError",
        "经纬度格式错误，经纬度之间请用英文逗号隔开",
      ]);
      setTimeout(() => {
        setErrorType(["", "经纬度格式错误，经纬度之间请用英文逗号隔开"]);
      }, 2000);
      return;
    }
    const lngLatList = value.split("\n");

    const result = getCoordinate(source, targetRef.current, lngLatList);

    setParseLngLatList(result);
  };

  const handleDownload = () => {
    const text = `百度经度,百度纬度,高德经度,高德纬度\n${parseLngLatList
      .join("\n")
      .replaceAll(/\[|\]/gi, "")}`;

    const blob = new Blob([text], { type: "text/csv;charset=utf-8" });

    const url = window.URL.createObjectURL(blob);
    let downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `${Date.now()}.csv`; // 导出的文件名
    downloadLink.click();
    window.URL.revokeObjectURL(url);
  };

  const handleChangeTab: MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLAnchorElement;
    const tabs = document.querySelectorAll("a.tab");
    tabs.forEach((tab) => {
      tab.classList.remove("tab-active");
    });
    target.classList.add("tab-active");

    const dataType = target.getAttribute("data-type")?.split(",");
    setSource(dataType?.[0] as "BD09" | "GCJ02");
    targetRef.current = dataType?.[1] as "BD09" | "GCJ02";
    setParseLngLatList([]);
  };

  return (
    <main className="flex flex-col items-center justify-between w-[80%] lg:w-[40%] m-auto">
      <h1>Map Util</h1>
      <div className="tabs tabs-boxed my-4" onClick={handleChangeTab}>
        <a className="tab tab-active" data-type="BD09,GCJ02">
          百度转高德
        </a>
        <a className="tab" data-type="GCJ02,BD09">
          高德转百度
        </a>
      </div>
      <textarea
        ref={textareaRef}
        className="textarea textarea-primary box-border w-full"
        rows={6}
        placeholder="每个地址的经纬度占一行，格式：经度,纬度
        例如：38.76623,116.43213"
      ></textarea>

      <button
        className="btn btn-primary m-4 h-8 min-h-8"
        onClick={handleConversion}
      >
        转换
      </button>

      {parseLngLatList.length > 0 && (
        <div className="w-full">
          <button className="btn btn-primary h-8 min-h-8" onClick={handleDownload}>下载</button>
          {source === "BD09" ? (
            <div className=" h-[50px] flex justify-start items-center">
              <div className="w-[25%]">百度经度</div>
              <div className="w-[25%]">百度纬度</div>
              <div className="w-[25%]">高德经度</div>
              <div className="w-[25%]">高德纬度</div>
            </div>
          ) : (
            <div className=" h-[50px] flex justify-start items-center">
              <div className="w-[25%]">高德经度</div>
              <div className="w-[25%]">高德纬度</div>
              <div className="w-[25%]">百度经度</div>
              <div className="w-[25%]">百度纬度</div>
            </div>
          )}
          <List
            itemCount={parseLngLatList.length}
            itemSize={50}
            height={500}
            width={"100%"}
          >
            {({ index, style }) => (
              <div style={style} className=" flex justify-start items-center">
                <div className="w-[25%]">{parseLngLatList[index][0]}</div>
                <div className="w-[25%]">{parseLngLatList[index][1]}</div>
                <div className="w-[25%]">{parseLngLatList[index][2]}</div>
                <div className="w-[25%]">{parseLngLatList[index][3]}</div>
              </div>
            )}
          </List>
        </div>
      )}

      <div
        className={`toast toast-top toast-center transition-all ease-in-out${
          errorType[0] ? " top-0" : " top-[-100px]"
        }`}
      >
        <div className="alert alert-error text-white">
          <span>{errorType[1]}</span>
        </div>
      </div>
    </main>
  );
}
