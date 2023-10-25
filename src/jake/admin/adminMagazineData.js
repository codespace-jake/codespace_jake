import paginate from "express-paginate";
import routes from "../../routes";
import User from "../../models/User";
import moment from "moment-timezone";
import 매거진모델 from "../../models/MagazineData";

export const adminMagazineData = async (req, res) => {
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
      매거진모델
        .find(findQuery)
        .sort(sortQuery)
        .limit(limit)
        .skip(req.skip)
        .exec(),
      매거진모델.countDocuments(findQuery),
    ]);

    const pageCount = Math.ceil(totalCount / limit);
    const pages = paginate.getArrayPages(req)(10, pageCount, req.query.page);
    // END: pagination 데이터

    res.render("product/magazine/productMagazine", {
      adminNameKo: "매거진 데이터",
      adminLink: routes.productMagazine,
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
export const getAdminMagazineDataCrud = async (req, res) => {
  try {
    const {
      params: { crudType },
      query: { itemID },
    } = req;
    let adminItem;
    if (itemID) {
      adminItem = await 매거진모델.findById(itemID);
    }
    const adminNameKo = "매거진 데이터";
    const adminNameEn = "Magazine";
    const adminLink = routes[`product${adminNameEn}`];
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
      res.render(`product/magazine/product${adminNameEn}CRUD`, renderObj);
    } else {
      await 매거진모델.findByIdAndDelete(itemID);
      res.send(
        `<script>location.href="${routes.product}${adminLink}"</script>`
      );
    }
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("오류가 발생했습니다:\\r\\n${err}");\
        location.href="${routes.home}"</script>`
    );
  }
};
export const postAdminMagazineDataCrud = async (req, res) => {
  try {
    const {
      params: { crudType },
      body,
    } = req;

    console.log("req.Body : ", req.body);
    console.log("body :", body);

    const adminNameKo = "매거진 데이터";
    const adminNameEn = "Magazine";
    const adminLink = routes[`product${adminNameEn}`];
    body.updatedAt = moment(new Date()).tz("Asia/Seoul");

    if (crudType === "create") {
      // 등록
      body.createdAt = moment(new Date()).tz("Asia/Seoul");
      await 매거진모델.create(body);
    } else if (crudType === "update") {
      // 수정
      const { itemID } = body;
      await 매거진모델.findByIdAndUpdate(itemID, body);
    }

    // 공통
    res.send(
      `<script>alert("${adminNameKo}가 ${
        crudType === "update" ? "수정" : "등록"
      }되었습니다.");\
        location.href="${routes.product}${adminLink}"</script>`
    );
  } catch (err) {
    console.log(err);
    res.send(
      `<script>console.log("오류가 발생했습니다: ",${err});\
        location.href="${routes.home}"</script>`
    );
  }
};

// ! 공통(121번줄) 코드 수정
// ! 경로를 location.href="${routes.product}${adminLink}/update?itemID=${adminItem._id}에서 /product/sample로가도록 수정
