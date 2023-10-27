import passport from "passport";
import paginate from "express-paginate";
import moment from "moment-timezone";
import routes from "../routes";
import User from "../models/User";
import Product from "../models/Product";
import Magazine from "../models/Magazine";
// 관리자 로그인
export const getAdminLogin = (req, res) => {
  try {
    if (req.user) {
      res.send(
        `<script>location.href="${routes.admin}${routes.adminUser}"</script>`
      );
    } else {
      res.render("admin/adminLogin");
    }
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
      location.href="${routes.home}"</script>`
    );
  }
};
export const postAdminLogin = (req, res, next) => {
  try {
    passport.authenticate("local", (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.send(
          `<script>alert("로그인 정보가 잘못되었습니다.");\
          location.href="${routes.admin}"</script>`
        );
      } else if (user.role === "general") {
        res.send(
          `<script>alert("마스터 관리자에게 승인 요청이 필요합니다.");\
          location.href="${routes.admin}"</script>`
        );
      } else {
        req.logIn(user, (e) => {
          if (err) {
            next(e);
          }
          res.send(
            `<script>location.href="${routes.admin}${routes.adminUser}"</script>`
          );
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
      res.send(
        `<script>location.href="${routes.admin}${routes.adminUser}"</script>`
      );
    } else {
      res.render("admin/adminRegister");
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
    body.role = "general";
    body.name = "일반 관리자";
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
            alert("회원가입이 완료되었습니다.\\r\\n마스터 관리자 승인 후 로그인 하세요.");\
            location.href="${routes.admin}"\
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

// 로그아웃
export const adminLogout = (req, res) => {
  try {
    req.logout();
    req.session.destroy(() => {
      res.send(`<script>location.href="${routes.admin}"</script>`);
    });
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
      location.href="${routes.home}"</script>`
    );
  }
};

// 비밀번호 변경
export const getAdminChangePW = (req, res) => {
  try {
    res.render("admin/adminChangePW");
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
      location.href="${routes.home}"</script>`
    );
  }
};
export const postAdminChangePW = async (req, res) => {
  try {
    const {
      body: { newPassword, newPassword1 },
    } = req;
    if (newPassword !== newPassword1) {
      res.send(`<script>\
                  alert("비밀번호가 일치하지 않습니다.\\r\\n다시 한 번 확인해 주세요.");\
                  history.go(-1);\
                </script>`);
    } else {
      const user = await User.findById({ _id: req.user._id });
      await user.setPassword(newPassword);
      await user.save();

      req.logout();
      req.session.destroy((e) => {
        res.send(
          `<script>alert("비밀번호가 변경되었습니다. \\r\\n다시 로그인해주세요.");\
          location.href="${routes.admin}"</script>`
        );
      });
    }
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
      location.href="${routes.home}"</script>`
    );
  }
};

// 관리자 계정 관리
export const adminUser = async (req, res) => {
  try {
    const {
      query: { searchKey, searchValue, limit },
    } = req;

    const findQuery = {
      $or: [{ role: "admin" }, { role: "master" }, { role: "general" }],
    };
    const sortQuery = { createdAt: 1 };

    // BEGIN: 검색 기능이 있을 경우
    const searchArr = [
      { code: "0", title: "아이디", value: "userID", type: "string" },
      { code: "1", title: "이름", value: "name", type: "string" },
    ];
    if (searchKey && searchValue) {
      findQuery[`${searchArr[parseInt(searchKey, 10)].value}`] = {
        $regex: searchValue,
        $options: "i",
      };
    }
    // END: 검색 기능이 있을 경우

    const [adminItems, totalCount] = await Promise.all([
      User.find(findQuery)
        .sort(sortQuery)
        .limit(req.query.limit)
        .skip(req.skip)
        .exec(),
      User.countDocuments(),
    ]);
    const pageCount = Math.ceil(totalCount / req.query.limit);
    const pages = paginate.getArrayPages(req)(10, pageCount, req.query.page);

    // 엑셀 다운로드용 전체 데이터
    const excelData = await User.find().sort(sortQuery);

    res.render("admin/adminUser", {
      adminNameKo: "관리자 계정",
      adminLink: routes.adminUser,
      limit,
      searchArr,
      searchKey,
      searchValue,
      adminItems,
      totalCount,
      pageCount,
      pages,
      excelData,
    });
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
      location.href="${routes.home}"</script>`
    );
  }
};
export const adminUserApprove = async (req, res) => {
  try {
    const {
      params: { userID },
    } = req;
    await User.findByIdAndUpdate(userID, { role: "admin" });
    res.send(
      `<script>\
        alert("승인 되었습니다.");\
        location.href="${routes.admin}${routes.adminUser}"\
      </script>`
    );
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
      location.href="${routes.home}"</script>`
    );
  }
};
export const adminUserDelete = async (req, res) => {
  try {
    const {
      params: { userID },
    } = req;
    await User.findByIdAndDelete(userID);
    res.send(
      `<script>location.href="${routes.admin}${routes.adminUser}"</script>`
    );
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
      location.href="${routes.home}"</script>`
    );
  }
};

// 관리자 상품 관리
export const adminProduct = async (req, res) => {
  try {
    const {
      query: { limit },
    } = req;

    // findQuery default 값
    const findQuery = {};
    // sortQuery default 값
    let sortQuery = { createdAt: -1 };

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

    res.render("admin/adminProduct", {
      adminNameKo: "상품 데이터",
      adminLink: routes.adminProduct,
      adminItems,
      totalCount,
      pageCount,
      pages,
      limit,
    });
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
        location.href="${routes.home}"</script>`
    );
  }
};

// ! CRUD
export const getAdminProductCrud = async (req, res) => {
  try {
    const {
      params: { crudType },
      query: { itemID },
    } = req;

    // BEGIN: 검색 기능이 있을 경우
    const categoryArr = [
      { value: "패션의류/잡화", type: "string" },
      { value: "뷰티", type: "string" },
      { value: "식품", type: "string" },
      { value: "가전디지털", type: "string" },
      { value: "반려동물용품", type: "string" },
      { value: "생활용품", type: "string" },
      { value: "주방용품", type: "string" },
      { value: "스포츠레저", type: "string" },
      { value: "자동차용품", type: "string" },
      { value: "완구/취미", type: "string" },
    ];

    let adminItem;
    if (itemID) {
      adminItem = await Product.findById(itemID);
    }
    const adminNameKo = "상품 데이터";
    const adminNameEn = "Product";
    const adminLink = routes[`admin${adminNameEn}`];
    const updateBool = crudType === "update";
    const users = await User.find();
    const renderObj = {
      crudType,
      adminNameKo,
      adminLink,
      categoryArr,
      updateBool,
      adminItem,
      users,
    };

    if (crudType !== "delete") {
      res.render(`admin/admin${adminNameEn}CRUD`, renderObj);
    } else {
      await Product.findByIdAndDelete(itemID);
      res.send(`<script>location.href="${routes.admin}${adminLink}"</script>`);
    }
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
        location.href="${routes.home}"</script>`
    );
  }
};
export const postAdminProductCrud = async (req, res) => {
  try {
    const {
      params: { crudType },
      body,
      file,
    } = req;

    const adminNameKo = "상품 데이터";
    const adminNameEn = "Product";
    const adminLink = routes[`admin${adminNameEn}`];
    body.updatedAt = moment(new Date()).tz("Asia/Seoul");
    let adminItem;

    if (crudType === "create") {
      // 등록
      body.thumbnail = file ? file.location : null;
      body.createdAt = moment(new Date()).tz("Asia/Seoul");
      adminItem = await Product.create(body);
    } else if (crudType === "update") {
      // 수정
      const { itemID } = body;
      adminItem = await Product.findById(itemID);
      body.thumbnail = file ? file.location : adminItem.thumbnail;
      await Product.findByIdAndUpdate(itemID, body);
    }

    console.log(body, "바디");

    // 공통
    res.send(
      `<script>alert("${adminNameKo}가 ${
        crudType === "update" ? "수정" : "등록"
      }되었습니다.");\
        location.href="${routes.admin}${adminLink}"</script>`
    );
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
        location.href="${routes.home}"</script>`
    );
  }
};

// 관리자 매거진 관리
export const adminMagazine = async (req, res) => {
  try {
    const {
      query: { limit },
    } = req;

    // findQuery default 값
    const findQuery = {};
    // sortQuery default 값
    let sortQuery = { createdAt: -1 };

    // BEGIN: pagination 데이터
    const [adminItems, totalCount] = await Promise.all([
      Magazine.find(findQuery)
        .sort(sortQuery)
        .limit(limit)
        .skip(req.skip)
        .exec(),
      Magazine.countDocuments(findQuery),
    ]);

    const pageCount = Math.ceil(totalCount / limit);
    const pages = paginate.getArrayPages(req)(10, pageCount, req.query.page);
    // END: pagination 데이터

    res.render("admin/adminMagazine", {
      adminNameKo: "매거진 데이터",
      adminLink: routes.adminMagazine,
      adminItems,
      totalCount,
      pageCount,
      pages,
      limit,
    });
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
        location.href="${routes.home}"</script>`
    );
  }
};

// ! CRUD
export const getAdminMagazineCrud = async (req, res) => {
  try {
    const {
      params: { crudType },
      query: { itemID },
    } = req;
    let adminItem;
    if (itemID) {
      adminItem = await Magazine.findById(itemID);
    }
    const adminNameKo = "매거진 데이터";
    const adminNameEn = "Magazine";
    const adminLink = routes[`admin${adminNameEn}`];
    const updateBool = crudType === "update";
    const users = await User.find();
    const renderObj = {
      crudType,
      adminNameKo,
      adminLink,
      updateBool,
      adminItem,
      users,
    };

    if (crudType !== "delete") {
      res.render(`admin/admin${adminNameEn}CRUD`, renderObj);
    } else {
      await Magazine.findByIdAndDelete(itemID);
      res.send(`<script>location.href="${routes.admin}${adminLink}"</script>`);
    }
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
        location.href="${routes.home}"</script>`
    );
  }
};
export const postAdminMagazineCrud = async (req, res) => {
  try {
    const {
      params: { crudType },
      body,
    } = req;

    console.log("req.Body : ", req.body);
    console.log("body :", body);

    const adminNameKo = "매거진 데이터";
    const adminNameEn = "Magazine";
    const adminLink = routes[`admin${adminNameEn}`];
    body.updatedAt = moment(new Date()).tz("Asia/Seoul");

    if (crudType === "create") {
      // 등록
      body.createdAt = moment(new Date()).tz("Asia/Seoul");
      await Magazine.create(body);
    } else if (crudType === "update") {
      // 수정
      const { itemID } = body;
      await Magazine.findByIdAndUpdate(itemID, body);
    }

    // 공통
    res.send(
      `<script>alert("${adminNameKo}가 ${
        crudType === "update" ? "수정" : "등록"
      }되었습니다.");\
        location.href="${routes.admin}${adminLink}"</script>`
    );
  } catch (err) {
    console.log(err);
    res.send(
      `<script>console.log("오류가 발생했습니다: ",${err});\
        location.href="${routes.home}"</script>`
    );
  }
};

/**
 * brandArr에 brand의 리스트들을 입력하고 주소창에 /admin/dummy를 입력하면 DB에 더미데이터들이 업데이트 되는 함수
 */
export const createDummyData = async (_, res) => {
  //- BEGIN: model의 schema대로 dummyData Object 선언
  //- category 목록 = [패션의류/잡화, 뷰티, 주방용품,생활용품,가전디지털,스포츠레저,식품,자동차용품,완구/취미,반려동물용품]
  const dummyData = {
    thumbnail:
      "https://codespace-bentley.s3.ap-northeast-2.amazonaws.com/sample/1698309817684food01.jpeg",
    category: "식품",
    brand: "",
    name: "",
    description: "이거먹으면 타르가 씻겨나가요",
    price: 1440000,
    saleRatio: 0,
  };
  //- END: dummyData Object

  //- FIXME: brandNameArr의 배열안에 브랜드의 리스트대로 dummyData.brand가 수정됨
  const brandArr = [
    "맛난 닥터톡스",
    "건강한 닥터톡스",
    "강동 닥터톡스",
    "전주 닥터톡스",
    "문정 닥터톡스",
  ];

  //- BEGIN: dummyData.name의 커스텀을 추가하여 brandNameArr배열 생성
  const brandAndNameArr = [];
  for (let i = 0; i < brandArr.length; i++) {
    const label = brandArr[i];
    const data = {
      brand: `${label}`,
      name: `닥터톡스 ${i + 1}호`,
    };
    brandAndNameArr.push(data);
  }
  //- END: brandAndNameArr Object

  try {
    // - BEGIN: 얉은 복사를 통한 DummyData Update
    const updatedDummyDataArr = [];
    brandAndNameArr.forEach((item) => {
      const updateDummyData = {
        ...dummyData,
        brand: item.brand,
        name: item.name,
      };
      updatedDummyDataArr.push(updateDummyData);
    });
    //- END: updatedDummyDateArr Object

    //- BEGIN: 더미데이터의 array를 순회하며 DB에 업데이트
    for (const data of updatedDummyDataArr) {
      await Product.create(data);
    }
    //- END: Create DB Document
    res.send("쨔란 더미데이터 생성완료! 🤡");
  } catch (error) {
    console.error("Error creating dummy data:", error);
    res.status(500).send("Failed to create dummy data.");
  }
};
