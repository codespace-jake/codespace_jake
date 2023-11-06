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
  })();
}
