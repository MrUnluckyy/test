import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { useCities } from "../contexts/CityContext";

import { useUrlLatLng } from "../hooks/useUrlLatLng";

import BackButton from "./BackButton";
import Button from "./Button";

import styles from "./Form.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [error, setError] = useState("");

  const [lat, lng] = useUrlLatLng();

  const { createNewCity, isLoading, cities } = useCities();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await createNewCity(newCity);
    navigate("/app/cities");
  };

  const isNewCity = (cityName) => {
    return !cities.find((city) => city.cityName === cityName);
  };

  useEffect(() => {
    if (!lat && !lng) return;

    const getCityData = async () => {
      try {
        setIsLoadingGeo(true);
        setError("");
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );
        const data = await res.json();

        if (!data.countryCode)
          throw new Error(
            "That does not seem like a city, please click somewhere else. 🤔"
          );

        if (!isNewCity(data.city))
          throw new Error(
            "This city already exists in the list. Select another city 😉"
          );

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName || "");
        setEmoji(convertToEmoji(data.countryCode || ""));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoadingGeo(false);
      }
    };

    getCityData();
  }, [lat, lng]);

  if (isLoadingGeo) return <Spinner />;

  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map 📍" />;

  if (error) return <Message message={error} />;

  return (
    <form
      className={`${styles.form} ${isLoading && styles.loading}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button onClick={() => console.log("Add")} type="primary">
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
