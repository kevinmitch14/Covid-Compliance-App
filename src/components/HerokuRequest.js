const proxyurl = process.env.REACT_APP_PROXY_URL;
const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${process.env.REACT_APP_GOOGLE_PLACE}&key=${process.env.REACT_APP_GOOGLE_KEY}`;

export const HerokuRequest = async () => {
    try {
        await fetch(proxyurl + url)
    } catch (error) {
        console.log(error)
    }
}
