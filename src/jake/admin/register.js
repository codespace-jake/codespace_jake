import User from "../../models/User";

// 회원가입
export const get관리자회원가입 = (req, res) => {
  try {
    if (req.user) {
      res.send(
        `<script>location.href="${routes.product}${routes.productUser}"</script>`
      );
    } else {
      res.render("product/productRegister");
    }
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
        location.href="${routes.home}"</script>`
    );
  }
};
export const post관리자회원가입 = async (req, res) => {
  try {
    const { body } = req;
    const users = await User.findOne({ userID: body.userID });
    body.role = "general";
    body.name = "일반 관리자";
    if (body.password !== body.password2) {
      res.send(
        `<script>\
            alert("비밀번호가 일치하지 않습니다.");\
            location.href="${routes.product}"\
          </script>`
      );
    } else if (users) {
      res.send(
        `<script>alert("이미 가입된 아이디 입니다.");history.go(-1);</script>`
      );
    } else {
      try {
        body.createdAt = moment(new Date()).tz("Asia/Seoul");
        body.updatedAt = moment(new Date()).tz("Asia/Seoul");
        const user = await User(body);
        await User.register(user, body.password);
        res.send(
          `<script>\
              alert("회원가입이 완료되었습니다.\\r\\n마스터 관리자 승인 후 로그인 하세요.");\
              location.href="${routes.product}"\
            </script>`
        );
      } catch (err) {
        console.log(err);
        res.send(
          `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
            location.href="${routes.home}"</script>`
        );
      }
    }
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}"); \
        location.href="${routes.home}"</script>`
    );
  }
};
