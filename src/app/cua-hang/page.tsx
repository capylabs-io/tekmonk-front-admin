"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Dela_Gothic_One } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { AvatarCard } from "@/components/shop/AvatarCard";
import { BackgroundCard } from "@/components/shop/BackgroundCard";
import { useRouter } from "next/navigation";
import WithAuth from "@/components/hoc/WithAuth";
import { useAvatarShops } from "@/lib/hooks/useAvatarShop";
import { useBackgroundShops } from "@/lib/hooks/useBackgroundShop";
import localFont from "next/font/local";
import { ItemModal } from "@/components/shop/ItemModal";

const delaGothicOne = localFont({
  src: "../.././assets/fonts/DelaGothicOne-Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-dela",
});

const Shop: React.FC = () => {
  const [openModal, setOpenModal] = useState(false)
  const [itemData, setItemData] = useState({
    imageUrl: '',
    title: '',
    price: '',
    type: '',
  })
  const router = useRouter();
  const avatarShops = useAvatarShops();
  const backgroundShops = useBackgroundShops().slice(0, 4);
  const handleClickItemCard = () => {
    setOpenModal(true)
    setItemData({
      imageUrl: '/image/shop/avatar-pic-1.png',
      title: 'Cozy Japanese Ramen',
      price: '999',
      type: 'Hình nền'
    })
  }
  return (
    <>
      <div>
        <div className="text-primary-900 px-6 text-SubheadLg">
          <span>Cửa hàng</span>
        </div>
        <div className="w-full flex items-center justify-center gap-x-4 relative bg-[url('/image/recruitment/recruitment-banner.png')] bg-no-repeat bg-center h-[256px] mt-4 max-sm:px-12 sm:px-12 max-lg:px-0">
          <div className="text-white">
            <div
              className={`${delaGothicOne.className} text-[28px] leading-[44px]`}
            >
              LÀM NHIỆM VỤ THU THẬP ĐIỂM
            </div>
            <div className="text-bodyMd mt-5">
              Tuỳ chỉnh profile cá nhân cùng với các vật phẩm trong cửa hàng
            </div>
          </div>
          <Image
            src="/image/recruitment/recruitment-pic.png"
            alt="left banner"
            className=""
            width={222}
            height={200}
          />
        </div>
        <div className="text-primary-900 px-4 mt-2">
          <div className="w-full flex justify-between">
            <span className="text-SubheadMd">AVATAR</span>
            <ArrowRight className="text-gray-600" size={24} />
          </div>
          <div className="mt-5 flex gap-x-5 overflow-hidden">
            {/* {avatarShops.map((avatar, index) => {
            return (
              <AvatarCard
                imageUrl={avatar.image}
                title={avatar.title}
                price={avatar.price}
                key={avatar.title}
              />
            );
          })} */}
            <AvatarCard
              imageUrl='/image/shop/avatar-pic-1.png'
              title={'Cozy Japanese Ramen'}
              price={'999'}
              key={'Cozy Japanese Ramen'}
              onClick={handleClickItemCard}
            />
          </div>
        </div>
        <hr className="border-t border-gray-200 my-4" />
        <div className="text-primary-900 px-4 mt-2">
          <div className="w-full flex justify-between">
            <span className="text-SubheadMd">HÌNH NỀN</span>
            <ArrowRight
              className="text-gray-600 cursor-pointer"
              size={24}
              onClick={() => router.push("/shop/background")}
            />
          </div>
          <div className="mt-5 flex gap-x-5 overflow-hidden">
            {backgroundShops.map((background, index) => {
              return (
                <BackgroundCard
                  imageUrl={background.image}
                  title={background.title}
                  price={background.price}
                  key={background.title}
                />
              );
            })}
          </div>
        </div>
      </div>
      <ItemModal
        imageUrl={itemData.imageUrl}
        title={itemData.title}
        price={itemData.price}
        type={itemData.type}
        isShowing={openModal} close={() => setOpenModal(false)} />
    </>
  );
};

// export default WithAuth(Shop);
export default Shop;
