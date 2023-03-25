import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { differenceInCalendarDays } from "date-fns";
import { UserContext } from "../UserContext";
export const Place = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuest, setMaxGuest] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [redirect, setRedirect] = useState("");
  let numberOfDays = 0;
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);
  useEffect(() => {
    if (!id) return;
    axios.get(`/place/${id}`).then((Response) => {
      setPlace(Response.data);
    });
  }, [id]);
  if (!place) return "";

  async function saveBooking() {
    const data = {
      name,
      mobile,
      checkIn,
      checkOut,
      maxGuest,
      place: place._id,
      price:
        differenceInCalendarDays(new Date(checkOut), new Date(checkIn)) *
        place.price,
    };
    const response = await axios.post("/bookings", data);
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }
  if (showAllPhotos) {
    return (
      <div class="mx-auto">
        <div className="absolute inset-0 bg-black text-white min-h-screen justify-center">
          <div className="bg-black p-8 grid gap-4">
            <div>
              <h2 className="text-3xl mr-48">Photos of {place.title}</h2>
              <button
                onClick={() => setShowAllPhotos(false)}
                className="fixed right-8 top-8 flex gap-1 py-1 px-1 rounded-2xl shadow shadow-black bg-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
            {place?.photos?.length > 0 &&
              place.photos.map((photo, i) => (
                <div key={i}>
                  <img
                    className="aspect-square object-cover cursor-pointer"
                    src={"http://localhost:4000/uploads/" + photo}
                    alt=""
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
  if (redirect) return <Navigate to={redirect} />;
  let INR = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  });
  return (
    <div className="mt-4 pt-8 bg-gray-100 -mx-8 px-8">
      <h1 className=" text-3xl">{place.title}</h1>
      <div className="flex">
        <div className="py-3 px-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64"
            />
          </svg>
        </div>

        <a
          target="_blank"
          href={"https://maps.google.com/?q=" + place.address}
          className=" block underline font-semibold my-3 gap-1 justify-center"
        >
          {place.address}
        </a>
      </div>
      <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-xl overflow-hidden">
          <div>
            {place.photos?.[0] && (
              <div>
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="aspect-square object-cover cursor-pointer"
                  src={place.photos[0]}
                  alt=""
                />
              </div>
            )}
          </div>
          <div className="grid ">
            {place.photos?.[1] && (
              <img
                onClick={() => setShowAllPhotos(true)}
                className="aspect-square object-cover cursor-pointer"
                src={place.photos[1]}
                alt=""
              />
            )}{" "}
            <div className="overflow-hidden">
              {place.photos?.[2] && (
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="aspect-square object-cover relative top-2 cursor-pointer"
                  src={place.photos[2]}
                  alt=""
                />
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAllPhotos(true)}
          className="absolute bottom-2 right-2 bg-transparent-50 px-2 py-1 bg-white rounded-2xl shadow-md shadow-gray-500 flex gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
          Show more photos
        </button>
      </div>

      <div className="mt-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h1 className="font-semibold text-2xl">Description</h1>
            {place.description}
          </div>
          <div className="bg-gray-300 rounded-xl p-2 -mx-2">
            Check-in: <b> {place.checkIn}:00</b>
            <br />
            Check-out: <b>{place.checkOut}:00</b>
            <br />
            Max number of guests: <b>{place.maxGuests}</b>
          </div>
        </div>
        <div>
          <div className="bg-white shadow p-4 rounded-2xl -mx-2">
            <div className="text-2xl text-center">
              Price: {<b>{INR.format(place.price)}</b>} /per night{" "}
            </div>
            <div className="border mt-4 rounded-2xl">
              <div className=" flex">
                <div className=" py-3 px-3 flex-col">
                  <label>Check-in </label>
                  <input
                    value={checkIn}
                    onChange={(ev) => setCheckIn(ev.target.value)}
                    type="date"
                  ></input>
                </div>
                <div className="py-3 px-3 border-l">
                  <label>Check-out </label>
                  <input
                    value={checkOut}
                    onChange={(ev) => setCheckOut(ev.target.value)}
                    type="date"
                  ></input>
                </div>
              </div>
              <div className="py-2 px-3 border-t">
                <label>Number of guests:</label>
                <input
                  value={maxGuest}
                  onChange={(ev) => setMaxGuest(ev.target.value)}
                  className="px-3 rounded-xl border-gray-300"
                  type="number"
                ></input>
              </div>
              {checkIn && checkOut && (
                <div className="py-2 px-3 border-t">
                  <label>Your Name:</label>
                  <input
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    className="px-3 rounded-xl border-gray-300"
                    type="text"
                  ></input>
                  <label>Phone number:</label>
                  <input
                    value={mobile}
                    onChange={(ev) => setMobile(ev.target.value)}
                    className="px-3 rounded-xl border-gray-300"
                    type="tel"
                  ></input>
                </div>
              )}
            </div>

            <button onClick={saveBooking} className="primary">
              Book this Place
              {checkIn && checkOut && (
                <>
                  <span>
                    {" "}
                    {INR.format(
                      differenceInCalendarDays(
                        new Date(checkOut),
                        new Date(checkIn)
                      ) * place.price
                    )}
                  </span>
                </>
              )}
            </button>
            {}
          </div>
        </div>
      </div>
      <div className="bg-white mt-4 p-2 -mx-8 px-8 pt-8 border-t">
        <div>
          <h1 className="font-semibold text-2xl">Extra Info</h1>
        </div>

        <div className="mb-4 mt-2 text-sm text-gray-800 leading-5">
          {place.extraInfo}
        </div>
      </div>
      <div className="py-8">
        <h1 className="font-semibold text-2xl">Perks</h1>
        {place?.perks?.length > 0 &&
          place.perks.map((perk, i) => (
            <div key={i} className="flex gap-2 py-1">
              <div className="justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
              <div className="justify-center">{perk}</div>
            </div>
          ))}
      </div>
    </div>
  );
};
