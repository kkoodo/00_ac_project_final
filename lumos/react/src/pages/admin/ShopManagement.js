import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useState} from 'react';
import {
    callCompanyInfoAPI, callShopInfolAPI,
    callCompanyInfoUpdateAPI, callShopInfoUpdateAPI
} from '../../apis/ShopManagementAPICalls';

import ShopManagementCSS from './ShopManagement.module.css';

import {bsrNumFormatter, cpTelFormatter, picTelFormatter, phoneFormatter} from '../../modules/Formmater';
import {useDaumPostcodePopup} from "react-daum-postcode";

import {decodeJwt} from '../../utils/tokenUtils';
import ErrorMindol from '../ErrorMindol';

export default function ShopManagement() {

    const token = decodeJwt(window.localStorage.getItem("accessToken")); 
    const isAdmin = token.auth.includes("ROLE_ADMIN");

    const dispatch = useDispatch();
    const companyInfo  = useSelector(state => state.companyReducer);  
    const shopInfo  = useSelector(state => state.shopReducer);  
    const [company, setCompany] = useState({});
    const [shop, setShop] = useState({});

    useEffect(
        () => {
            dispatch(callCompanyInfoAPI({}));            
            dispatch(callShopInfolAPI({}));
        }
        ,[]
    );

    useEffect(
        () => {
            setCompany({
                bsrNum: companyInfo.bsrNum,
                cpNm: companyInfo.cpNm,
                rpNm: companyInfo.rpNm,
                cpTel: companyInfo.cpTel,
                bsType: companyInfo.bsType,
                bsItem: companyInfo.bsItem,
                cpAdsNum: companyInfo.cpAdsNum,
                cpAds: companyInfo.cpAds,
                cpAdsDetail: companyInfo.cpAdsDetail,
                cpEmail: companyInfo.cpEmail
            })
        }
        ,[companyInfo]
    );

    useEffect(
        () => {
            setShop({
                shopNm: shopInfo.shopNm,
                shopWebAds: shopInfo.shopWebAds,
                shopEmail: shopInfo.shopEmail,
                shopDesc: shopInfo.shopDesc,
                omSt: shopInfo.omSt,
                omNum: shopInfo.omNum,
                csTel: shopInfo.csTel,
                csEmail: shopInfo.csEmail,
                csHour: shopInfo.csHour,
                picNm: shopInfo.picNm,
                picTel: shopInfo.picTel,
                picEmail: shopInfo.picEmail
             })
        }
        ,[shopInfo]
    );

    const companyInfoHandler = (e) => {
        setCompany({
            ...company,
            [e.target.name]: e.target.value
        })
    };

    const shopInfoHandler = (e) => {
        setShop({
            ...shop,
            [e.target.name]: e.target.value
        })
    }

    const addressAPI = () => {
        open({onComplete: completeHandler, left: 500, top: 150, popupTitle: "LUMOS ?????? ??????" , theme: {bgColor: "#B9E7DF"}});
    };

    const CURRENT_URL = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    const open = useDaumPostcodePopup(CURRENT_URL);

    const completeHandler = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') extraAddress += data.bname;
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }
        setCompany({
            ...company,
            cpAdsNum: data.zonecode,
            cpAds: fullAddress,
            cpAdsDetail: ''
        })

        document.getElementById("cpAdsDetail").focus();
    };

    const submitHandler = (e) => {
        if(e.target.id == "company") {
            const isSure = window.confirm("????????? ????????? ?????????????????????????");
            if(isSure == true) {
                // console.log("????????? ????????? ??????", company);
                const companyFormData = new FormData();
                companyFormData.append("bsrNum", company.bsrNum);
                companyFormData.append("cpNm", company.cpNm);
                companyFormData.append("rpNm", company.rpNm);
                companyFormData.append("cpTel", company.cpTel);
                companyFormData.append("bsType", company.bsType);
                companyFormData.append("bsItem", company.bsItem);
                companyFormData.append("cpAdsNum", company.cpAdsNum);
                companyFormData.append("cpAds", company.cpAds);
                companyFormData.append("cpAdsDetail", company.cpAdsDetail);
                companyFormData.append("cpEmail", company.cpEmail);
                dispatch(callCompanyInfoUpdateAPI({form: companyFormData}));
                alert("????????? ????????? ?????????????????????.");
                window.location.reload();
            } else {
                alert("????????? ????????? ????????? ?????????????????????.");
                window.location.reload();
            }
        }
        if(e.target.id == "shop") {
            const isSure = window.confirm("????????? ????????? ?????????????????????????");
            if(isSure == true) {
                // console.log("????????? ????????? ??????", shop);
                const shopFormData = new FormData();
                shopFormData.append("shopNm", shop.shopNm);
                shopFormData.append("shopWebAds", shop.shopWebAds);
                shopFormData.append("shopEmail", shop.shopEmail);
                shopFormData.append("shopDesc", shop.shopDesc);
                shopFormData.append("omSt", shop.omSt);
                shopFormData.append("omNum", shop.omNum);
                shopFormData.append("csTel", shop.csTel);
                shopFormData.append("csEmail", shop.csEmail);
                shopFormData.append("csHour", shop.csHour);
                shopFormData.append("picNm", shop.picNm);
                shopFormData.append("picTel", shop.picTel);
                shopFormData.append("picEmail", shop.picEmail);
                dispatch(callShopInfoUpdateAPI({form: shopFormData}));
                alert("????????? ????????? ?????????????????????.");
                window.location.reload();
            } else {
                alert("????????? ????????? ????????? ?????????????????????.");
                window.location.reload();
            }
        }
    }

    return (
        <>
        {
            isAdmin
            ?
            <>
                <div className={ShopManagementCSS.boxing}>
                <div className={ShopManagementCSS.info}>
                <table>
                    <thead>
                        <tr>
                            <th style={{backgroundColor: "white"}}>????????? ??????</th>
                            <td style={{textAlign: "right"}}>
                                <button onClick={submitHandler} id="company">??????</button>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>????????? ?????? ??????</th>
                            <td>{companyInfo && bsrNumFormatter(companyInfo.bsrNum)}</td>
                        </tr>
                        <tr>
                            <th>??????</th>
                            <td>
                                <input 
                                    type={'text'}
                                    name="cpNm" 
                                    defaultValue={company.cpNm} 
                                    onChange={companyInfoHandler}/>
                            </td>
                        </tr>
                        <tr>
                            <th>????????? ??????</th>
                            <td>
                                <input 
                                    type={'text'}
                                    name="rpNm" 
                                    defaultValue={company.rpNm} 
                                    onChange={companyInfoHandler}/>
                            </td>
                        </tr>
                        <tr>
                            <th>??????</th>
                            <td>
                                <input 
                                    type={'text'}
                                    name="bsType" 
                                    defaultValue={company.bsType} 
                                    onChange={companyInfoHandler}/>
                            </td>
                        </tr>
                        <tr>
                            <th>??????</th>
                            <td>
                                <input 
                                    type={'text'}
                                    name="bsItem"
                                    defaultValue={company.bsItem} 
                                    onChange={companyInfoHandler}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>????????? ??????</th>
                            <td>
                                <input 
                                    type={'text'}
                                    name="cpAdsNum" 
                                    id="cpAdsNum"
                                    onChange={companyInfoHandler}
                                    style={{width: "130px"}}
                                    defaultValue={company.cpAdsNum}
                                    placeholder="????????????"
                                    disabled
                                ></input>&nbsp;&nbsp;&nbsp;
                                <button onClick={addressAPI}>??????</button>
                                <br/>
                                <input 
                                    type={'text'}
                                    name="cpAds" 
                                    id="cpAds"
                                    onChange={companyInfoHandler} 
                                    defaultValue={company.cpAds}
                                    placeholder="??????"
                                    disabled
                                ></input>&nbsp;&nbsp;&nbsp;
                                <input 
                                    type={'text'}
                                    name="cpAdsDetail" 
                                    id="cpAdsDetail"
                                    onChange={companyInfoHandler}
                                    defaultValue={company.cpAdsDetail}
                                    placeholder="????????????"
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <th>?????? ??????</th>
                            <td>
                                <input 
                                    name="cpTel"
                                    type={'tel'} 
                                    // value??? ?????? ??? '-' ????????? ??????
                                    value={cpTelFormatter(company.cpTel) ?? ''}
                                    onChange={companyInfoHandler}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>?????????</th>
                            <td>
                                <input 
                                    name="cpEmail"
                                    type={'email'}
                                    value={company.cpEmail ?? ''} 
                                    onChange={companyInfoHandler}
                                ></input>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
                <div className={ShopManagementCSS.info}>
                <table>
                    <thead>
                        <tr>
                            <th style={{backgroundColor: "white"}}>????????? ??????</th>
                            <td style={{textAlign: "right"}}>
                                <button onClick={submitHandler} id="shop">??????</button>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>????????????</th>
                            <td>{shopInfo.shopNm}</td>
                        </tr>
                        <tr>
                            <th>????????? ??????</th>
                            <td>
                                <input 
                                    name="shopWebAds"
                                    type={'text'}
                                    defaultValue={shop.shopWebAds} 
                                    onChange={shopInfoHandler}/>
                            </td>
                        </tr>
                        <tr>
                            <th>????????? ?????????</th>
                            <td>
                                <input 
                                    name="shopEmail"
                                    type={'email'}
                                    defaultValue={shop.shopEmail} 
                                    onChange={shopInfoHandler}/>
                            </td>
                        </tr>
                        <tr>
                            <th>????????? ??????</th>
                            <td>
                                <input
                                    name="shopDesc"
                                    type={'text'}
                                    defaultValue={shop.shopDesc} 
                                    onChange={shopInfoHandler}/>
                            </td>
                        </tr>
                        <tr>
                            <th>???????????? ??????</th>
                            <td>
                                <input
                                    name="csTel"
                                    type={'tel'}
                                    // value??? ?????? ??? '-' ????????? ?????? 
                                    value={picTelFormatter(shop.csTel) ?? ''} 
                                    onChange={shopInfoHandler}/>
                            </td>
                        </tr>
                        <tr>
                            <th>???????????? ?????????</th>
                            <td>
                                <input 
                                    name="csEmail"
                                    type={'email'}
                                    defaultValue={shop.csEmail} 
                                    onChange={shopInfoHandler}/>
                            </td>
                        </tr>
                        <tr>
                            <th>???????????? ????????????</th>
                            <td>
                                <textarea
                                    name="csHour"
                                    defaultValue={shop.csHour} 
                                    onChange={shopInfoHandler}
                                    style={{display: "flex"}}
                                ></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>?????????????????? ?????????</th>
                            <td>
                                <input 
                                    name="picNm"
                                    type={'text'}
                                    defaultValue={shop.picNm} 
                                    onChange={shopInfoHandler}/>
                            </td>
                        </tr>
                        <tr>
                            <th>?????????????????? ????????? ?????????</th>
                            <td>
                                <input 
                                    name="picTel"
                                    type={'text'}
                                    // value??? ?????? ??? '-' ????????? ??????
                                    value={phoneFormatter(shop.picTel) ?? ''}
                                    onChange={shopInfoHandler}/>                        
                            </td>
                        </tr>
                        <tr>
                            <th>?????????????????? ????????? ?????????</th>
                            <td>
                                <input 
                                    name="picEmail"
                                    type={'email'}
                                    defaultValue={shop.picEmail} 
                                    onChange={shopInfoHandler}/>
                            </td>
                        </tr>
                        <tr>
                            <th>??????????????? ????????????</th>
                            <td>
                                <select
                                    name="omSt"
                                    onChange={shopInfoHandler}
                                >
                                    <option
                                        type={'radio'}
                                        defaultValue={shopInfo.omSt} 
                                    >{shopInfo.omSt}</option>
                                    <option
                                        type={'radio'}
                                        defaultValue={shopInfo.omSt == "?????????" ? "????????????" : "?????????"}
                                    >{shopInfo.omSt == "?????????" ? "????????????" : "?????????"}</option>
                                </select>                               
                            </td>
                        </tr>
                        <tr>
                            <th>?????????????????? ??????</th>
                            <td>
                                <input 
                                    name="omNum"
                                    type={'text'}
                                    defaultValue={shop.omNum} 
                                    onChange={shopInfoHandler}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
                </div>
            </>
            :
            <ErrorMindol/>
        }
        </>
    )
}