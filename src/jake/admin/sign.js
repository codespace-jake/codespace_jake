import passport from "passport";
import routes from "../../routes";

// 관리자 로그인
export const get관리자로그인 = (req, res) => {
  try {
    if (req.user) {
      res.send(`<script>location.href="${routes.product}${routes.productUser}"</script>`);
    } else {
      res.render("product/productLogin");
    }
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
        location.href="${routes.home}"</script>`
    );
  }
};

export const post관리자로그인 = (req, res, next) => {
  try {
    passport.authenticate("local", (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.send(
          `<script>alert("로그인 정보가 잘못되었습니다.");\
            location.href="${routes.product}"</script>`
        );
      } else if (user.role === "general") {
        res.send(
          `<script>alert("마스터 관리자에게 승인 요청이 필요합니다.");\
            location.href="${routes.product}"</script>`
        );
      } else {
        req.logIn(user, (e) => {
          if (err) {
            next(e);
          }
          res.send(`<script>location.href="${routes.product}${routes.productUser}"</script>`);
        });
      }
    })(req, res, next);
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
        location.href="${routes.home}"</script>`
    );
  }
};

// 로그아웃
export const 로그아웃 = (req, res) => {
  try {
    req.logout();
    req.session.destroy(() => {
      res.send(`<script>location.href="${routes.product}"</script>`);
    });
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
      location.href="${routes.home}"</script>`
    );
  }
};
