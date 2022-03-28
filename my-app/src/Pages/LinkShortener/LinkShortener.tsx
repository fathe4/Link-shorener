import React, { useEffect, useState } from 'react'
import { affiliatePostApi } from '../../Services/LinkShortenerApi/LinkShortenPostApi'
import { deleteUrlApi } from '../../Services/LinkShortenerApi/DeleteUrlApi'
import { toast } from 'react-toastify'
export default function Affiliate() {
    const [url, setUrl] = useState<string>("")
    const [shortUrl, setShortUrl] = useState<string>("")
    const [links, setLinks] = useState<affiliateLinks[]>([])
    const [loadings, setLoadings] = useState<boolean>(true)

    useEffect(() => {
        if (loadings) {
            fetch(`http://localhost:5001/shortUrls`)
                .then(res => res.json())
                .then(data => setLinks(data))
                .finally(() => setLoadings(false))
        }

    }, [loadings])
    // SUBMIT LINK
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const data = { url, date }
        console.log(url, date);

        affiliatePostApi(data, setShortUrl, setLoadings)

    }
    // DELETE SHORT URL 
    const deleteUrl = (shortUrl: string) => deleteUrlApi(shortUrl, setLoadings)

    // COPY SHORTEN URL
    function copyText(entryText: string) {
        navigator.clipboard.writeText(entryText);
        toast.success("Link copied", {
            position: "bottom-right",
        });
    }


    return (
        <div className='container mx-auto'>  <h1 className='font-semibold text-gray-800 dark:text-white'>Create Affiliate Link </h1>
            <form onSubmit={handleSubmit} className="my-4 d-flex">
                <div className="flex items-center mr-6 my-2 w-100">
                    <input onBlur={(e) => setUrl(e.target.value)} name="fulURL" id='fullURL' type="url" className="bg-purple-white shadow rounded border-0 p-3  w-full" placeholder="Example: https://www.google.com/" />
                    <button type="submit" className="inline-flex justify-center py-3 px-8 border border-transparent drop-shadow-md text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Create</button>
                </div>

            </form>
            <h2 className="font-semibold text-gray-800">Shorten Url</h2>
            {shortUrl ? <div className="flex items-center mr-6 my-2 w-100">
                <input value={`http://localhost:5001/${shortUrl}`} name="fulURL" id='fullURL' type="url" className="bg-purple-white shadow rounded border-0 p-3  w-full" placeholder="Example: https://www.google.com/" />
                <button type="submit" className="inline-flex justify-center py-3 px-8 border border-transparent drop-shadow-md text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => copyText(`http://localhost:5001/${shortUrl}`)}>Copy</button>
            </div> : ""}
            <section className="antialiased  text-gray-600 ">
                <div className="flex flex-col justify-center h-full">

                    <div className="w-full  mx-auto bg-white  shadow-lg rounded-sm border border-gray-200">
                        <header className="px-5 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800">Shorten links</h2>
                        </header>
                        <div className="p-3">
                            <div className="overflow-x-auto">
                                <table className="table-auto w-full">
                                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 text-black	">
                                        <tr>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-left">Date</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-left">Full Link</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-left">Shorten Link</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-left">Clicks</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-left">Action</div>
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-gray-100">
                                        {
                                            loadings ? 'Loading' :
                                                !links?.length ? 'No URLs Found' : links?.map(link => {
                                                    return <tr key={link._id}>
                                                        <td className="p-2 whitespace-nowrap">
                                                            <p>{link.date}</p>
                                                        </td>
                                                        <td className="p-2 whitespace-nowrap">
                                                            <div className="text-left">{link.full}</div>
                                                        </td>
                                                        <td className="p-2 whitespace-nowrap">
                                                            <div className="text-left"><a href={`http://localhost:5001/${link.short}`}>{link.short}</a> <i className="fa-solid fa-copy cursor-pointer"
                                                                onClick={() => copyText(`http://localhost:5001/${link.short}`)} title="Copy"></i></div>
                                                        </td>
                                                        <td className="p-2 whitespace-nowrap">
                                                            <div className="text-left">{link.clicks}</div>
                                                        </td>
                                                        <td>
                                                            <button className="inline-flex justify-center py-1 px-6 border border-transparent drop-shadow-md text-xs font-medium rounded-md text-white bg-red-600 " onClick={() => deleteUrl(link.short)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                })
                                        }


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}