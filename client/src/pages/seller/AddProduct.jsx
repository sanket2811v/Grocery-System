import { useState } from "react";
import toast from "react-hot-toast";
import { assets, categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const { axios } = useAppContext();

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      const productData = {
        name,
        description: description.split("\n").filter(Boolean),
        category: category.trim(),
        price: Number(price),
        offerPrice: Number(offerPrice),
        inStock: true,
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));

      files.filter(Boolean).forEach((file) => {
        formData.append("images", file);
      });

      const { data } = await axios.post('/api/seller/add-product', formData, {
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message || "Product added successfully");
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add product";
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-1 min-h-0 flex-col"
      >
        <div className="no-scrollbar flex-1 min-h-0 overflow-y-auto md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                  />

                  <img
                    className="max-w-24 cursor-pointer"
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
                        : assets.upload_area
                    }
                    alt="uploadArea"
                    width={100}
                    height={100}
                  />
                </label>
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Description</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium">Category</label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            required
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option key={index} value={item.path}>
                {item.path}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Product Price</label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>

          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Offer Price</label>
            <input
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>
        </div>

        <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-4 md:px-10">
          <button
            type="submit"
            className="px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer w-full sm:w-auto shadow-sm"
          >
            ADD
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
