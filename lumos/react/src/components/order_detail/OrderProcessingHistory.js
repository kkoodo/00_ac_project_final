import {dateFormatter} from '../../modules/Formmater';

export default function OrderProcessingHistory({order}) {

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th colSpan={2}>
                            주문 처리 이력
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>주문일</th>
                        <td>{order.orderDate ? dateFormatter(order.orderDate) : '-'}</td>
                    </tr>
                    <tr>
                        <th>발주 확인일</th>
                        <td>{order.orderConf ? dateFormatter(order.orderConf) : '-'}</td>
                    </tr>
                    <tr>
                        <th>배송 출발일</th>
                        <td>{order.deliveryStart ? dateFormatter(order.deliveryStart) : '-'}</td>
                    </tr>
                    <tr>
                        <th>배송 완료일</th>
                        <td>{order.deliveryEnd ? dateFormatter(order.deliveryEnd) : '-'}</td>
                    </tr>
                    <tr>
                        <th>구매 확정일</th>
                        <td>{order.purchaseConf ? dateFormatter(order.purchaseConf) : '-'}</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
};