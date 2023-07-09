import React from "react";
import Spinner from "./Spinner";

import styles from "./CountryList.module.css";

import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCities } from "../contexts/CityContext";

const CountryList = () => {
  const { cities, isLoading } = useCities();

  const countries = cities.reduce((arr, city) => {
    if (!arr.find((el) => el.country === city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    } else {
      return arr;
    }
  }, []);

  if (isLoading) {
    return <Spinner />;
  }
  if (!cities.length) {
    return (
      <Message message="No visited countries yet. Add them by clicking on a city in the map" />
    );
  }
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.country} country={country} />
      ))}
    </ul>
  );
};

export default CountryList;
