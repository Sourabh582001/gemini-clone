
interface Country {
    name: { common: string };
    idd?: {
        root?: string;
        suffixes?: string[];
    };
}

export async function fetchCountries(): Promise<{ name: string; code: string }[]> {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,idd");
    const data: Country[] = await res.json();

    return data.map((country) => ({
        name: country.name.common,
        code: (country.idd?.root || '') + (country.idd?.suffixes?.[0] || ''),
    }));
}