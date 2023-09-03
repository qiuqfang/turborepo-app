"use client";

import { MouseEventHandler, useRef, useState } from "react";

import { FixedSizeList as List } from "react-window";
import { getCoordinate } from "@/util";
import Tabs from "@/components/Tabs";
import ParseTable from "@/components/ParseTable";

export default function Home() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [parseLngLatList, setParseLngLatList] = useState<number[][]>([]);
  const [source, setSource] = useState<"BD09" | "GCJ02">("BD09");
  const targetRef = useRef<"BD09" | "GCJ02">("GCJ02");

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

  return (
    <main className="flex flex-col items-center justify-between w-[80%] lg:w-[40%] m-auto">
      <h1>Map Util</h1>
      <Tabs
        setParseLngLatList={setParseLngLatList}
        setSource={setSource}
        targetRef={targetRef}
      />
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
        <ParseTable source={source} parseLngLatList={parseLngLatList} />
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
