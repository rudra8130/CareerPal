import React from "react";
import { FiDownload } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import { usecoins } from "../../apis/user.api";

function Downloadbtn({ docRef, user, setuser }) {
  const handlePdf = useReactToPrint({
    contentRef: docRef,
    documentTitle: "CareerPal PDF",
  });

  const handleDownload = async () => {
    try {
      const coinResponse = await usecoins({
        coins: 10,
        action: "resume-builder",
      });

      setuser((prev) => ({
        ...prev,
        interviewCoin: coinResponse?.interviewCoin,
      }));
      handlePdf();
    } catch (error) {
      if (error.response?.status === 403) {
        return alert("Not enough interview coins");
      }
      alert(error.response?.data.message || "something went wrong");
    }
  };
  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs text-white"
    >
      <FiDownload />
      Download PDFs
    </button>
  );
}

export default Downloadbtn;
