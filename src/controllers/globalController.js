import routes from "../routes";
import paginate from "express-paginate";
import Product from "../models/Product";
import passport from "passport";
import User from "../models/User";
import moment from "moment-timezone";

// 홈 Home
export const getHome = async (req, res) => {
  try {
    let isLogin = false;
    if (req.user) {
      isLogin = true;
    }

    res.render("home", { isLogin });
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
      location.href="${routes.home}"</script>`
    );
  }
};

export const postHome = async (req, res, next) => {
  try {
    passport.authenticate("local", (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.send(
          `<script>alert("로그인 정보가 잘못되었습니다.");\
          location.href="${routes.home}"</script>`
        );
      } else {
        req.logIn(user, (e) => {
          if (err) {
            next(e);
          }
          res.send(`<script>location.href="${routes.home}"</script>`);
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
export const getLogout = (req, res) => {
  try {
    req.logout();
    req.session.destroy(() => {
      res.send(`<script>location.href="${routes.home}"</script>`);
    });
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
      location.href="${routes.home}"</script>`
    );
  }
};

// 상품 Product

export const product = async (req, res) => {
  try {
    let isLogin = false;
    if (req.user) {
      isLogin = true;
    }

    const {
      query: { sort, limit },
    } = req;

    // findQuery default 값
    const findQuery = {};
    // sortQuery default 값
    let sortQuery = { createdAt: -1 };

    // BEGIN: 분류 기능이 있을 경우
    const sortArr = [
      { code: "0", title: "가격 높은 순", value: "salePrice", order: -1 },
      { code: "1", title: "가격 낮은 순", value: "salePrice", order: 1 },
      { code: "2", title: "최신순", value: "createdAt", order: -1 },
      { code: "3", title: "이름순", value: "name", order: 1 },
    ];

    const sortCode = sort || sortArr[0].code;
    if (sort) {
      sortQuery = {};
      sortArr.forEach((x, i) => {
        if (x.code === sort)
          sortQuery[`${sortArr[i].value}`] = sortArr[i].order;
      });
    }

    // END: 분류 기능이 있을 경우

    // BEGIN: pagination 데이터
    const [adminItems, totalCount] = await Promise.all([
      Product.find(findQuery)
        .sort(sortQuery)
        .limit(limit)
        .skip(req.skip)
        .exec(),
      Product.countDocuments(findQuery),
    ]);

    const pageCount = Math.ceil(totalCount / limit);
    const pages = paginate.getArrayPages(req)(10, pageCount, req.query.page);
    // END: pagination 데이터

    res.render("product", {
      adminNameKo: "상품 데이터",
      adminLink: routes.adminProduct,
      adminItems,
      sortArr,
      sortCode,
      totalCount,
      pageCount,
      pages,
      limit,
      isLogin,
    });
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
        location.href="${routes.home}"</script>`
    );
  }
};

// 로그인
export const getLogin = (req, res) => {
  try {
    if (req.user) {
      res.send(`<script>location.href="${routes.home}"</script>`);
    } else {
      res.render("sign/login");
    }
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
      location.href="${routes.home}"</script>`
    );
  }
};

export const postLogin = async (req, res, next) => {
  try {
    passport.authenticate("local", (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.send(
          `<script>alert("로그인 정보가 잘못되었습니다.");\
          location.href="${routes.home}"</script>`
        );
      } else {
        req.logIn(user, (e) => {
          if (err) {
            next(e);
          }
          res.send(`<script>location.href="${routes.home}"</script>`);
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

// 회원가입
export const getAdminRegister = (req, res) => {
  try {
    if (req.user) {
      res.send(`<script>location.href="${routes.home}"</script>`);
    } else {
      res.render("sign/register");
    }
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
      location.href="${routes.home}"</script>`
    );
  }
};
export const postAdminRegister = async (req, res) => {
  try {
    const { body } = req;
    const users = await User.findOne({ userID: body.userID });
    body.role = "normal";
    body.name = "일반 회원";
    if (body.password !== body.password2) {
      res.send(
        `<script>\
          alert("비밀번호가 일치하지 않습니다.");\
          location.href="${routes.admin}"\
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
            alert("회원가입이 완료되었습니다.\\r\\n코드스페이스에 오신걸 환영해요!.");\
            location.href="${routes.home}"\
          </script>`
        );
      } catch (err) {
        console.log(err);
        res.send(
          `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
          location.href="${routes.adminRegister}"</script>`
        );
      }
    }
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}"); \
      location.href="${routes.adminRegister}"</script>`
    );
  }
};
