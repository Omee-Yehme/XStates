import { useEffect, useState } from "react";

const State = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const [countryError, setCountryError] = useState(false);
    const [stateError, setStateError] = useState(false);

    useEffect(() => {
        fetch("https://crio-location-selector.onrender.com/countries")
            .then((res) => {
                if (!res.ok) throw new Error();
                return res?.json();
            })
            .then((data) => {
                setCountries(data);
                setCountryError(false);
            })
            .catch(() => {
                setCountries([]);
                setCountryError(true);
            });
    }, []);

    const handleCountryChange = (e) => {
        const country = e.target.value;
        setSelectedCountry(country);
        setSelectedState("");
        setSelectedCity("");
        setCities([]);
        fetch(
            `https://crio-location-selector.onrender.com/country=${country}/states`
        )
            .then((res) => {
                if (!res.ok) throw new Error();
                return res?.json();
            })
            .then((data) => {
                setStates(data);
                setStateError(false);
            })
            .catch(() => {
                setStates([]);
                setStateError(true);
            });
    };

    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state);
        setSelectedCity("");
        fetch(
            `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${state}/cities`
        )
            .then((res) => res.json())
            .then((data) => setCities(data))
            .catch(() => setCities([]));
    };

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
    };

    return (
        <div>
            <h1>Select Location</h1>
            <select
                style={{ padding: "10px", width: "400px", marginRight: "10px" }}
                onChange={handleCountryChange}
                value={selectedCountry}
            >
                <option value="">Select Country</option>
                {countries.map((country) => (
                    <option key={country} value={country}>
                        {country}
                    </option>
                ))}
            </select>
            {countryError && (
                <p style={{ color: "red", marginTop: "5px" }} role="alert">
                    Failed to load countries.
                </p>
            )}
            <select
                style={{ padding: "10px", width: "150px", marginRight: "10px" }}
                onChange={handleStateChange}
                value={selectedState}
                disabled={!selectedCountry}
            >
                <option value="">Select State</option>
                {states.map((state) => (
                    <option key={state} value={state}>
                        {state}
                    </option>
                ))}
            </select>
            {stateError && (
                <p style={{ color: "red", marginTop: "10px" }}>
                    Failed to load states.
                </p>
            )}
            <select
                style={{ padding: "10px", width: "150px" }}
                onChange={handleCityChange}
                value={selectedCity}
                disabled={!selectedState}
            >
                <option value="">Select City</option>
                {cities.map((city) => (
                    <option key={city} value={city}>
                        {city}
                    </option>
                ))}
            </select>
            {selectedCity && (
                <p style={{ marginTop: "20px", fontSize: "larger" }}>
                    You selected {selectedCity}, {selectedState}, {selectedCountry}
                </p>
            )}
        </div>
    );
};

export default function States() {
    return (
        <div>
            <State />
        </div>
    );
}
