import passport from "passport";
import paginate from "express-paginate";
import moment from "moment-timezone";
import routes from "../routes";
import User from "../models/User";
import Sample from "../models/Sample";

// 관리자 로그인
export const getAdminLogin = (req, res) => {
  try {
    if (req.user) {
      res.send(`<script>location.href="${routes.admin}${routes.adminUser}"</script>`);
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
          res.send(`<script>location.href="${routes.admin}${routes.adminUser}"</script>`);
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
      res.send(`<script>location.href="${routes.admin}${routes.adminUser}"</script>`);
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
      res.send(`<script>alert("이미 가입된 아이디 입니다.");history.go(-1);</script>`);
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

    const findQuery = { $or: [{ role: "admin" }, { role: "master" }, { role: "general" }] };
    const sortQuery = { createdAt: 1 };

    // BEGIN: 검색 기능이 있을 경우
    const searchArr = [
      { code: "0", title: "아이디", value: "userID", type: "string" },
      { code: "1", title: "이름", value: "name", type: "string" },
    ];
    if (searchKey && searchValue) {
      findQuery[`${searchArr[parseInt(searchKey, 10)].value}`] = { $regex: searchValue, $options: "i" };
    }
    // END: 검색 기능이 있을 경우

    const [adminItems, totalCount] = await Promise.all([
      User.find(findQuery).sort(sortQuery).limit(req.query.limit).skip(req.skip).exec(),
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
    res.send(`<script>location.href="${routes.admin}${routes.adminUser}"</script>`);
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
      location.href="${routes.home}"</script>`
    );
  }
};

// 관리자 샘플 관리
export const adminSample = async (req, res) => {
  try {
    const {
      query: { sort, searchCode, searchValue, limit },
    } = req;

    // findQuery default 값
    const findQuery = {};
    // sortQuery default 값
    let sortQuery = { createdAt: -1 };

    // BEGIN: 분류 기능이 있을 경우
    const sortArr = [
      { code: "0", title: "최근등록순", value: "createdAt", order: -1 },
      { code: "1", title: "이전등록순", value: "createdAt", order: 1 },
      { code: "2", title: "최근수정순", value: "updatedAt", order: -1 },
      { code: "3", title: "데이터3 내림차순", value: "data3", order: -1 },
    ];
    const sortCode = sort || sortArr[0].code;
    if (sort) {
      sortQuery = {};
      sortArr.forEach((x, i) => {
        if (x.code === sort) sortQuery[`${sortArr[i].value}`] = sortArr[i].order;
      });
    }
    // END: 분류 기능이 있을 경우

    // BEGIN: 검색 기능이 있을 경우
    const searchArr = [
      { code: "0", title: "데이터1", value: "data1", type: "string" },
      { code: "1", title: "데이터2", value: "data2", type: "string" },
      { code: "2", title: "데이터3", value: "data3", type: "string" },
      { code: "3", title: "데이터4", value: "data4", type: "string" },
      { code: "4", title: "데이터5", value: "data5", type: "number" },
      { code: "5", title: "유저 아이디 [객체]", value: "userID", type: "objectID" },
      { code: "6", title: "유저 아이디 [배열]", value: "userIDs", type: "objectID" },
    ];
    if (searchCode && searchValue) {
      for (let i = 0; i < searchArr.length; i += 1) {
        if (searchArr[i].code === searchCode) {
          if (searchArr[i].type === "string") {
            findQuery[searchArr[i].value] = { $regex: searchValue, $options: "i" };
          } else if (searchArr[i].type === "number") {
            findQuery[searchArr[i].value] = Number(searchValue);
          } else if (searchArr[i].type === "objectID") {
            const userIDs = await User.find({ userID: { $regex: searchValue, $options: "i" } }).distinct("_id");
            findQuery[searchArr[i].value] = { $in: userIDs };
          }
          break;
        }
      }
    }
    // END: 검색 기능이 있을 경우

    // BEGIN: pagination 데이터
    const [adminItems, totalCount] = await Promise.all([
      Sample.find(findQuery).sort(sortQuery).limit(limit).skip(req.skip).exec(),
      Sample.countDocuments(findQuery),
    ]);
    const pageCount = Math.ceil(totalCount / limit);
    const pages = paginate.getArrayPages(req)(10, pageCount, req.query.page);
    // END: pagination 데이터

    // BEGIN: 엑셀 다운로드용 전체 데이터
    const excelData = await Sample.find(findQuery).sort(sortQuery);
    // END: 엑셀 다운로드용 전체 데이터

    res.render("admin/adminSample", {
      adminNameKo: "샘플 데이터",
      adminLink: routes.adminSample,
      sortCode,
      sortArr,
      limit,
      searchArr,
      searchCode,
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
export const getAdminSampleCrud = async (req, res) => {
  try {
    const {
      params: { crudType },
      query: { itemID },
    } = req;
    let adminItem;
    if (itemID) {
      adminItem = await Sample.findById(itemID).populate([
        {
          path: "userID",
          model: "User",
        },
        {
          path: "userIDs",
          model: "User",
        },
      ]);
    }
    const adminNameKo = "샘플 데이터";
    const adminNameEn = "Sample";
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
      await Sample.findByIdAndDelete(itemID);
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
export const postAdminSampleCrud = async (req, res) => {
  try {
    const {
      params: { crudType },
      body,
      file,
    } = req;

    const adminNameKo = "샘플 데이터";
    const adminNameEn = "Sample";
    const adminLink = routes[`admin${adminNameEn}`];
    body.updatedAt = moment(new Date()).tz("Asia/Seoul");
    let adminItem;

    if (crudType === "create") {
      // 등록
      body.thumbnail = file ? file.location : null;
      body.createdAt = moment(new Date()).tz("Asia/Seoul");
      adminItem = await Sample.create(body);
    } else if (crudType === "update") {
      // 수정
      const { itemID } = body;
      adminItem = await Sample.findById(itemID);
      body.thumbnail = file ? file.location : adminItem.thumbnail;
      await Sample.findByIdAndUpdate(itemID, body);
    }

    // 공통
    res.send(
      `<script>alert("${adminNameKo}가 ${crudType === "update" ? "수정" : "등록"}되었습니다.");\
      location.href="${routes.admin}${adminLink}/update?itemID=${adminItem._id}"</script>`
    );
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
      location.href="${routes.home}"</script>`
    );
  }
};
