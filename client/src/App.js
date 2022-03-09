/* react라이프 사이클
  1) constroctor() : 처음에 컨스턱트 함수를 불러온후
  2) componentWillMount() : 컴포넌트가 Mount되기 전에 componentWillMount함수를 불러온다.
  3) render() : 실제로 컴포넌트를 화면에 그린후에
  4) componentDidMount() : componentDidMount함수를 불러온다-API서버에 접근해 data를 가져오는 역할을 수행하는데 react는 비동기 통신을 따르기 때문에 API server에서 응답이 없을시 로딩이 지속되도록 설정

  - 이후에 props or state 같은 것들이 변경될 때 shouldComponentUpdate() 함수를 불러와 render()함수를 재실행하여 View를 갱신한다.
  -> react는 화면의 변화를 알아서 감지하여 스스로 재구성 해주기 때문에 프로그래머 입장에서는 바뀌는 상태만 잘 관리하면 된다.
   */
import './App.css';
import Customer from './components/Customer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { withStyles } from '@material-ui/core/styles'/* CSS관련 라이브러리 */
import { useEffect } from 'react';
import { useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({ /* styles변수를 정의하는 것으로 페이지에 CSS라이브러리 적용가능  */
  root: { /* root클래스에 넓이가 100%, 위로 여백이 가중치로 3만큼,  */
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: "auto" //전체 바깥쪽에 해당하는 root는 x축에 오버플로우가 발생할수있도록 처리하겠다는 뜻
  },
  table: { /* table은 무조건 최소 1080픽셀 이상으로 출력되도록 -> 웹페이지 창을 줄여도 크로스바가 생기면서 table의 크기는 줄어들지 않는다. */
    minWidth: 1080
  },
  progress: { //marterial-ui에서 가져온 패키지로 위쪽으로 여백을 가중치를 2만큼 주겠다
    margin: theme.spacing(2)
  }
})



function App(props) {

  const [customers, setCustomers] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/customer',{
      headers: {
        'Accept': 'application / json'
      }
    })
      .then((res) => res.json())
      .then((body) => {
        setCustomers(body)
      })
  }, []);

const stateRefresh = () => {
  setCustomers([])
  fetch('http://localhost:5000/api/customer')
      .then((res) => res.json())
      .then((body) => {
        setCustomers(body)
      })
 }

 useEffect(() => {
  const timer = setInterval(() => {
    setProgress(progress => progress >= 100 ? 0 : progress + 1);
  }, 200);

  return () => {
    clearInterval(timer);
  };
}, []);

  const { classes } = props; //위에서 정의한 styles객체를 적용하기위한 변수 classes 선언, props는 보통 변경할 수 없는 것들에 대해서 선언
  return (
    <div>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>{/* TableHead에는 Table의 속성값을 정의 */}
            <TableRow>{/* TableRow로 감싸서 아래의 항목을 한줄에 속성 형태로 출력된다. */}
              <TableCell>번호</TableCell>
              <TableCell>이미지</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>생년월일</TableCell>
              <TableCell>성별</TableCell>
              <TableCell>직업</TableCell>
              <TableCell>설정</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers ? customers.map(c => { /* custormers에 속한 모든 값을 c라는 에일리어스로하여 map함수로 반복하여 */
              return (<Customer /* Customer.js컴포넌트의 형식에 담아서 반환한다.*/
                stateRefresh = {stateRefresh}
                key={c.id} /* customers데이터들의 id값을 key로 하여 각 데이터 들을 구분한다, 필수! */
                id={c.id}
                image={c.image}
                name={c.name}
                birthday={c.birthday}
                gender={c.gender}
                job={c.job}
              ></Customer>)
            }) :
              <TableRow>{/* Table의 한줄의 한 칸에서 CircularProgress가 작동하도록 선언  */}
                <TableCell colSpan="6" align='center'>{/* progress가 한줄의 6칸을 모두 사용할 수 있도록 하며 가운데에 출력되도록 설정 */}
                  <CircularProgress className={progress} variant="determinate" value={progress}></CircularProgress>{/*  */}
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </Paper>
      {/* <CustomerAdd stateRefresh = {stateRefresh}></CustomerAdd> */}
    </div>
  );
}

export default  withStyles(styles)(App); // styles를 적용하기위해 APP을 withStyles(styles)(APP) 형태로 감싸서 내보낸다

/* DB를 따로 구축하지않고 바로 API서버에서 데이터를 다루는 경우 function안으로   */
/* state = { //data가 변경될 수 있는 경우 이므로 state로 선언 
  customers: ""
  completed: 0 // progress로 쓰는 CircularProgress가 시작이 0부터하여 게이지가 끝까지 다 차는 형태이므로 시작값을 알리기 위해 사용 
}

callApi = async () => { // API를 불러올수 있도록 하는 비동기적으로 아래 내용을 수행
  const response = await fetch('/api/customers'); // 접근하고자 하는 페이지에 접근하여
  const body = await response.json(); // body변수에 respones값을 json형식으로 지정하여
  return body; // 반환 
}

componentDidMount()
{ // 일반적으로 API서버에 접근해 data를 가져오는 해당 라이브러리로 할 수 있는데, react라이브러리기 때문에 생명주기가 있으며 모든 컴포넌트가 Mount되었을 때 실행되는 부분 
  this.timer = setInterval(this.progress, 20) // timer를 불러와서 progress함수가 0.2초마다 실행되도록 설정 
  this.callApi() //API를 불러올 수 있도록 하는 callApi를 호출한다,
  .then(res=> this.setState({customers: res})) // callApi로 부터 반환받은 값을 customers라는 state값에 넣은후 이를 res라고 하는 것 과 같은 의미 
  .catch(err => console.log(err)); //Error가 발생한경우 에러 찍어주기 
}


progress=()=> { // 로딩 애니메이션을 위한 함수 
  const {completd} = this.state; // completed변수의 state변수를 가져올 수 있도록 선언하고 
  this.setState({completed: completer >=100? 0 : completed +1}) //가져온 변수의 complted state의 값을 completer로 하여 100까지 차면 다시 0으로 감소하게 하고 100이 아닌 경우에는 1씩값을 증가  
} */
