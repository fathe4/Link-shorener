import { toast } from "react-toastify";

export const affiliatePostApi = (formData: { url: string; date: string; }, setShortUrl: React.Dispatch<React.SetStateAction<string>>, setLoadings: React.Dispatch<React.SetStateAction<boolean>>) => {
    fetch('http://localhost:5001/shortUrls', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data, 'data');
            if (data.result.insertedId) {
                toast.success(`Link shortened`, {
                    position: 'bottom-right'
                })
                setShortUrl(data.uniqueUrl)
                setLoadings(true)
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
