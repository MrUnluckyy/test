import { useReducer } from "react";
import { useContext, createContext, useEffect } from "react";

const URL = "http://localhost:8000";

const CityContext = createContext();

const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/selected": {
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    }
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error("Uknown action type");
  }
};

function CityProvider({ children }) {
  const [{ cities, currentCity, error, isLoading }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const fetchCities = async () => {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({ type: "rejected", payload: "Ukwnown error loading cities" });
      }
    };

    fetchCities();
  }, []);

  const getCurrentCity = async (id) => {
    if (currentCity.id === Number(id)) return;
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/selected", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There is an issue with getting the current city",
      });
    }
  };

  const createNewCity = async (payload) => {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${URL}/cities`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        dispatch({ type: "city/created", payload });
      }
    } catch {
      dispatch({
        type: "rejected",
        payload: "Uknown issue with creating new city",
      });
    }
  };

  const deleteCity = async (id) => {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${URL}/cities/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        dispatch({ type: "city/deleted", payload: id });
      }
    } catch {
      dispatch({
        type: "rejected",
        payload: "Uknown issue with deleting the city",
      });
    }
  };

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCurrentCity,
        createNewCity,
        deleteCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

function useCities() {
  const context = useContext(CityContext);

  if (context === undefined) {
    throw new Error("CitiesContext was used outside the CitiesProvider");
  }

  return context;
}

export { CityProvider, useCities };
