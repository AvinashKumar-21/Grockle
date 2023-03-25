import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "../components/Image";
export const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/all").then((response) => {
      setPlaces([...response.data]);
    });
  }, []);
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  });
  return (
    <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-14 gap-6 gap-y-8">
      {places.length > 0 &&
        places.map((i, key) => (
          <Link to={"/place/" + i._id} key={key}>
            <div className="bg-gray-500 rounded-2xl flex h-45 w-45">
              {i.photos.length > 0 && (
                <Image
                  className=" rounded-2xl object-cover aspect-square"
                  src={i.photos[0]}
                  alt=""
                />
              )}
            </div>
            <div className="mt-2">
              <h3 className="font-bold truncate">{i.address}</h3>
              <h2 className="text-sm truncate text-gray-500">{i.title}</h2>
              <div className="mt-1">
                <span className="font-bold">{USDollar.format(i.price)}</span>
                {"/"}
                per night
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};
