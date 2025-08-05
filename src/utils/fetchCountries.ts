import axios from "axios";

export const fetchCountries = async () => {
  const res = await axios.get("https://restcountries.com/v3.1/all?fields=name,idd");
  return res.data.map((c: any) => ({
    name: c.name.common,
    code: c.idd.root ? `${c.idd.root}${c.idd.suffixes?.[0] || ""}` : "",
  })).filter((c: any) => c.code);
};