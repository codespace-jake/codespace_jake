import $ from "jquery";

const searchAddressInfo = document.getElementById("register-page");
if (searchAddressInfo) {
  (() => {
    $(() => {
      const searchBtn = $("#address__search-btn");

      // * 검색버튼 클릭시 주소 API 실행
      searchBtn.on("click", () => {
        new daum.Postcode({
          oncomplete(data) {
            let addr = ""; // 주소 변수
            const extraAddr = ""; // 참고항목 변수
            if (data.userSelectedType === "R") {
              // 사용자가 도로명 주소를 선택했을 경우
              addr = data.roadAddress;
            } else {
              // 사용자가 지번 주소를 선택했을 경우(J)
              addr = data.jibunAddress;
            }
            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if (data.userSelectedType === "R") {
              // 우편번호와 주소 정보를 해당 필드에 넣는다.
              addr = data.roadAddress;
              document.getElementById("address").value = addr + extraAddr;
            } else if (data.userSelectedType === "J") {
              // 사용자가 선택한 주소가 지번 주소일 때
              // 우편번호와 주소 정보를 해당 필드에 넣는다.
              addr = data.jibunAddress;
              document.getElementById("detailAddress").value = addr;
            }
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById("detail-address").focus();
          },
        }).open();
      });
    });


    //유효성 검사
    const name = $('#name')
    const userID = $('#userID')
    const button = $('.btn.btn-primary')
    const password1 = $('#password')
    const password2 = $('#password2')
    const tel = $('#phoneNum')
    const alarmName = $('.alarm__name')
    const alarmID = $('.alarm__id')
    const alarmPassword1 = $('.alarm__password')
    const alarmPassword2 = $('.alarm__password2')


    const checkLength = (value) => {
      return value.length >= 4 && value.length <= 12
    }
    
    const checkNonKorean = (value) => {
      const reg = /^[A-Za-z0-9]+$/;      
      return reg.test(value)
    }

    const checkName = (value) =>{
      const reg= /^[가-힣]{2,6}$/
      return reg.test(value)
    }

    const checkPassword = (value) => {
      const reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;
      return reg.test(value)
    }




//- 이름
    const validateName = () =>{
      if(checkName(name.val())){
        alarmName.css('color','black')
      }else{
        button.prop('disabled',true)
        alarmName.css('color','red')
      }
      
    }
    name.on('input', validateName);


//- ID
    const validateUserID = ()=>{
      if(checkLength(userID.val()) && checkNonKorean(userID.val())){
        alarmID.css('color','black')
      }else{
        button.prop('disabled',true)
        alarmID.css('color','red')
      }
    }
    userID.on('input', validateUserID);
    
    

//- 패스워드
    const validatePassword1 = () => {
      if(checkPassword(password1.val())){
        alarmPassword1.css('opacity','0')
      }else{
        button.prop('disabled',true)
        alarmPassword1.css('opacity','1')
      }
    }
    password1.on('input', validatePassword1);



    const validatePassword2 = () =>{
      if(password1.val() === password2.val()){
        alarmPassword2.css('opacity','0')
      }else{
        button.prop('disabled',true)
        alarmPassword2.css('opacity','1')
      }
    }
    password2.on('input', validatePassword2);


//- 전화번호
 const insertHyphen = ()=> {
  let inputValue = tel.val();

  inputValue = inputValue.replace(/[^0-9]/g, "");

  if (inputValue.length > 3) {
    inputValue = inputValue.substring(0, 3) + "-" + inputValue.substring(3);
  }

  if (inputValue.length > 8) {
    inputValue = inputValue.substring(0, 8) + "-" + inputValue.substring(8);
  }

  tel.val(inputValue);
 }
  const test = () =>{
    if(tel.val().length >= 13 ){
        button.prop('disabled',false)
        button.css('cursor','pointer')
      }else{
        button.prop('disabled',true)
      }
  }

  tel.on('input',()=>{insertHyphen(),test()})
    
  })();
}
