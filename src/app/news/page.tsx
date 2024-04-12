"use client";
import { Button } from "@/components/common/Button";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import LeaderboardMock from "@/mock/leaderboard-mock.json";
import { Pagination } from "@/components/common/Pagination";
import { UserInfoContainer } from "@/components/home/UserInfoContainer";
import WithAuth from "@/components/hoc/WithAuth";
import { DataTable } from "@/components/common/DataTable";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import { DialogFooter } from "@/components/common/Dialog";
import { NEWS_HEADERS, EVENT_HEADERS, TABS } from "@/const/news";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { CreateEventModal } from "@/components/news/CreateEventModal";
import { CreateNewsModal } from "@/components/news/CreateNewsModal";
import { useFetchNews } from "@/lib/hook/useFetchNews";

const Hiring: React.FC = () => {
  const newsFilter = "filters[type][$eq]=news&populate[0]=user";
  const eventFilter = "filters[type][$eq]=event&populate[0]=user";

  const [currentTab, setCurrentTab] = useState(TABS.NEWS);

  const handleChangeTab = (value: string) => {
    setCurrentTab(value);
  };

  const news = useFetchNews(newsFilter);
  const events = useFetchNews(eventFilter);

  const handleOnClick = () => {};
  const handleNextPage = () => {};
  const handlePrevPage = () => {};

  return (
    <>
      <div className="text-xl text-primary-900 px-8 w-full flex justify-between items-center">
        <div>Tin tức</div>
        <UserInfoContainer />
      </div>
      <hr className="bg-gray-200 w-full my-4" />
      <Tabs
        className="px-8"
        defaultValue={TABS.NEWS}
        value={currentTab}
        onValueChange={handleChangeTab}
      >
        <TabsList className="my-[1px] border-none">
          <TabsTrigger className="border bg-gray-50 rounded-tl-lg" value="news">
            Tin tức
          </TabsTrigger>
          <TabsTrigger
            className="border bg-gray-50 rounded-tr-lg"
            value="event"
          >
            Sự kiện
          </TabsTrigger>
          <hr className="bg-gray-200 w-full my-4" />
        </TabsList>
        <TabsContent
          value="news"
          className="border rounded-xl rounded-tl-none py-4"
        >
          <div className="w-full flex justify-end items-center px-8">
            <Dialog>
              <DialogTrigger className="text-xs h-max px-4 py-2 text-white rounded-lg bg-primary-600 flex items-center">
                <Plus size={16} className="mr-2" />
                <div>Thêm bài viết</div>
              </DialogTrigger>
              <DialogContent className="sm:min-w-md">
                <div className="w-full text-center text-SubheadLg text-primary-900">
                  Thông tin
                </div>
                <hr className="bg-gray-200" />
                <CreateNewsModal customClassname="px-6 mt-4" />
                <hr className="bg-gray-200" />
                <DialogFooter className="sm:justify-end px-6">
                  <DialogClose className="!rounded-xl text-sm px-6 py-3 border">
                    Huỷ
                  </DialogClose>
                  <Button className="!rounded-xl text-sm !py-2">
                    Thêm bài viết
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mx-8 mt-4 rounded-xl border border-gray-300">
            <DataTable data={news} headers={NEWS_HEADERS} isDetailTable />
          </div>
          <div className="px-8 mt-4 flex justify-end">
            <Pagination
              currentPage={1}
              totalPages={2}
              onClickNextPage={handleNextPage}
              onClickPrevPage={handlePrevPage}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="event"
          className="border rounded-xl rounded-tl-none py-4"
        >
          <div className="w-full flex justify-end items-center px-8">
            <Dialog>
              <DialogTrigger className="text-xs h-max px-4 py-2 text-white rounded-lg bg-primary-600 flex items-center">
                <Plus size={16} className="mr-2" />
                <div>Thêm bài viết</div>
              </DialogTrigger>
              <DialogContent className="sm:min-w-md">
                <div className="w-full text-center text-SubheadLg text-primary-900">
                  Thông tin
                </div>
                <hr className="bg-gray-200" />
                <CreateEventModal customClassname="px-6 mt-4" />
                <hr className="bg-gray-200" />
                <DialogFooter className="sm:justify-end px-6">
                  <DialogClose className="!rounded-xl text-sm px-6 py-3 border">
                    Huỷ
                  </DialogClose>
                  <Button className="!rounded-xl text-sm !py-2">
                    Thêm bài viết
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mx-8 mt-4 rounded-xl border border-gray-300">
            <DataTable data={events} headers={EVENT_HEADERS} isDetailTable />
          </div>
          <div className="px-8 mt-4 flex justify-end">
            <Pagination
              currentPage={1}
              totalPages={2}
              onClickNextPage={handleNextPage}
              onClickPrevPage={handlePrevPage}
            />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default WithAuth(Hiring);
