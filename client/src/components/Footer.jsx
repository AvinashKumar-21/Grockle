import React from "react";

export const Footer = () => {
  return (
    <div className=" -mr-16 -ml-16 mt-32 -mb-16  bg-gray-900">
      <div className="">
        <div className="max-w-2xl mx-auto text-white py-10">
          <div className="text-center">
            <h3 className="text-3xl mb-6"> Download our App </h3>
            <p> Travel far enough, you meet yourself. </p>
            <div className="flex justify-center my-6">
              <div className="cursor-pointer flex items-center border rounded-lg px-4 py-2 w-52 mx-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/888/888857.png"
                  className="w-7 md:w-8"
                />
                <div className="text-left ml-3">
                  <p className="text-xs text-gray-200">Download on </p>
                  <p className="text-sm md:text-base"> Google Play Store </p>
                </div>
              </div>
              <div className="cursor-pointer flex items-center border w-auto rounded-lg px-4 py-2 mx-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/888/888841.png"
                  className="w-7 md:w-8"
                />
                <div className="text-left ml-3">
                  <p className="text-xs text-gray-200">Download on </p>
                  <p className="text-sm md:text-base"> Apple Store </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 -mb-8 flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400">
            <p className="order-2 md:order-1 mt-8 md:mt-0">
              {" "}
              &copy; grockle, 2023.{" "}
            </p>
            <div className="order-1 md:order-2">
              <span className="cursor-pointer px-2">About us</span>
              <span className="cursor-pointer px-2 border-l">Contact us</span>
              <span className="cursor-pointer px-2 border-l">
                Privacy Policy
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
