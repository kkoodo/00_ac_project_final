import { useEffect } from "react";

export default function Bill({order : {orderProductList : product, ...etc}, orderInfo, setOrderInfo}) {

    let orderPc = 0;
    product.forEach(pd => orderPc += pd.pdPc * pd.orderAmount);
    const defaultDeliveryPc = 3000;
    const deliveryGuidePc = 50000;

    // ★ props-drilling
    useEffect(
        () => {
            setOrderInfo({
                ...orderInfo,
                orderPc: orderPc,
                deliveryPc: orderInfo.deliveryMt == "일반택배" ? (orderPc > deliveryGuidePc ? 0 : defaultDeliveryPc) : 0,
                totalPc: orderInfo.deliveryMt == "일반택배" ? (orderPc > deliveryGuidePc ? orderPc : orderPc + defaultDeliveryPc) : orderPc
            })
        },
        [orderInfo.deliveryMt]
    )

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>
                            주문서
                        </th>
                        <td>
                            {/* {etc.orderCode} */}
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>주문가격</th>
                        <td id="orderPc">{orderPc.toLocaleString('ko-KR')} 원</td>
                    </tr>
                    <tr>
                        <th>배송비</th>
                        <td id="deliveryPc">
                            {
                                orderInfo.deliveryMt == "일반택배"
                                ?
                                (
                                    orderPc > deliveryGuidePc
                                    ?
                                    "무료배송"
                                    :
                                    defaultDeliveryPc.toLocaleString('ko-KR') + " 원"
                                )
                                :
                                "0 원"
                            }
                        </td>
                    </tr>
                    <tr>
                        <th>합계</th>
                        <td id="totalPc">
                            {
                                orderInfo.deliveryMt == "일반택배"
                                ?
                                (
                                    orderPc > deliveryGuidePc
                                    ?
                                    (orderPc + 0).toLocaleString('ko-KR') + " 원"
                                    :
                                    (orderPc + defaultDeliveryPc).toLocaleString('ko-KR') + " 원"
                                )
                                :
                                (orderPc + 0).toLocaleString('ko-KR') + " 원"
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}