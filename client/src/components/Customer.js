import React from 'react'
import TableRow from '@material-ui/core/TableRow' /* marterial은 ui툴, table row에 table cell(각 원소)를 담기 위해 가지고 온다. */
import TableCell from '@material-ui/core/TableCell'
/* import CustomerDelete from './CustomerDelete' */

const Customer = (props) => { // props로 받은 custormers값을 아래대로 처리하여 반환
    return ( // 하나의 줄에 한명분의 데이터 값을 처리한다. id, 사진, 이름, .....

        <TableRow>{/* TableRow는 하나의 행, 즉 한줄을 의미한다. */}
            <TableCell>{props.id}</TableCell>
            <TableCell><img src={props.image} alt='profile'></img></TableCell>{/* 프로필 이미지_이미지 속성 태그, alt속성은 시각장애인을 위한 설명 */}
            <TableCell>{props.name}</TableCell>
            <TableCell>{props.birthday}</TableCell>
            <TableCell>{props.gender}</TableCell>
            <TableCell>{props.job}</TableCell>
            <TableCell>{/* <CustomerDelete stateRefresh = {props.stateRefresh} id={props.id}></CustomerDelete> */}</TableCell>
        </TableRow>
    )
}



export default Customer