import { toast } from "react-toastify"

export const deleteUrlApi = (shortUrl: String, setLoadings: React.Dispatch<React.SetStateAction<boolean>>) => {
    const isTrue = window.confirm("Are you sure?")
    if (isTrue) {
        fetch(`http://localhost:5001/delete/shortUrl/${shortUrl}`, {
            method: 'DELETE'
        }).then(res => res.json())
            .then(data => {
                if (data.deletedCount) {
                    toast.error(`Link Deleted`, {
                        position: 'bottom-right'
                    })
                    setLoadings(true)
                }

            })
            .finally(() => setLoadings(false))
    }

}
