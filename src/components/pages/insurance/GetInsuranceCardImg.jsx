import React, { useState, useEffect, useRef } from 'react'
/*    Components    */
import UserNavigation from '../../common/UserNavigation'
import WideButton from '../../common/WideButton'
/*    API    */
import { getInsuranceCompany } from '../../../utils/insuranceCompaniesAPI'
import { uploadImage } from '../../../utils/dashboard'
import { addInsuranceCard } from '../../../utils/usersAPI'
/*    Icons    */
import GetImage from '../../../assets/insuranceCompanies/GetImage.svg'
import Plus from '../../../assets/insuranceCompanies/Plus.svg'
import InsuranceAddCard from '../../../assets/insuranceCompanies/InsuranceAddCard.svg'

const GetInsuranceCardImg = ({ loggedInUser, companyId, cardName, userName, cardNumber }) => {
  const [company, setCompany] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [image, setImage] = useState('')
  const [imageURL, setImageURL] = useState('')
  const [imgbbURL, setImgbbURL] = useState('')
  const hiddenFileInput = useRef(null)

  useEffect(() => {
    const getCompany = async () => {
      const result = await getInsuranceCompany(companyId)

      setCompany(result)
    }

    getCompany()
  }, [])

  const dragHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (
        e.dataTransfer.files[0].type === 'image/jpeg' ||
        e.dataTransfer.files[0].type === 'image/jpg' ||
        e.dataTransfer.files[0].type === 'image/png'
      ) {
        setImageURL(URL.createObjectURL(e.dataTransfer.files[0]))
        setImage(e.dataTransfer.files[0])
        const result = await uploadImage(e.dataTransfer.files[0])
        const imgUrl = result.data.url
        setImgbbURL(imgUrl)
      }
    } else {
      setDragActive(false)
    }
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
        setImageURL(URL.createObjectURL(file))
        setImage(file)
        const result = await uploadImage(file)
        const imgUrl = result.data.url
        setImgbbURL(imgUrl)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('dragenter', (e) => dragHandler(e))

    return () => {
      document.removeEventListener('dragenter', (e) => dragHandler(e))
    }
  }, [])

  const handleInputClick = () => {
    hiddenFileInput.current.click()
  }

  const handelData = async () => {
    const obj = {
      name: cardName,
      number: cardNumber,
      nameOnCard: userName,
      imageURL: imgbbURL
    }
    const result = await addInsuranceCard(loggedInUser, obj)
  }
  return (
    <div>
      <div>
        <UserNavigation loggedInUser={loggedInUser} />
      </div>

      <div className="flex justify-around mt-20">
        <div className="flex flex-col  ">
          <div className="text-right">
            <div className="flex items-center mb-10">
              <p className="text-[26px] text-right ml-10">{company.name}</p>
              <img className="h-16" draggable="false" src={company.logo} alt="Company image" />
            </div>
            <div className="text-[22px]">
              <p className="text-right">صورة الكارت</p>
            </div>
          </div>
          <div className=" w-[700px] h-[350px]">
            {imageURL ? (
              <div>
                <img draggable="false" src={imageURL} alt="cardImage" />
              </div>
            ) : (
              <div
                onClick={() => handleInputClick()}
                onDragEnter={(e) => dragHandler(e)}
                onDragLeave={(e) => dragHandler(e)}
                onDragOver={(e) => dragHandler(e)}
                onDrop={(e) => handleDrop(e)}
                className="mt-10"
              >
                <div className="border-[3px] border-dashed border-lightBlue w-[700px] h-[350px] flex flex-col items-center rounded-[10px]">
                  <div className="mt-16">
                    <img src={GetImage} alt="" />
                  </div>

                  <div className="mt-6">
                    <p className="text-[#0583F2] text-[22px]">
                      صورة كارت التأمين<span className="text-[#F99D1C]"> سارى</span> الصلاحية
                    </p>
                  </div>

                  <button className="flex text-[24px] text-lightBlue justify-center border rounded-[10px] border-lightBlue mt-10 px-10 py-2">
                    <img src={Plus} alt="" />
                    <p className="mr-2">صورة الكارت</p>
                  </button>
                </div>
                <input
                  type="file"
                  accept=".png, .jpeg, .jpg"
                  ref={hiddenFileInput}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <div className="mt-12">
            <WideButton
              //   disabled={userName.length > 0 ? false : true}
              content={'حفظ الكارت'}
              handleOnClick={handelData}
            />
          </div>
        </div>

        <div className="">
          <img src={InsuranceAddCard} alt="" />
        </div>
      </div>
    </div>
  )
}

export default GetInsuranceCardImg
