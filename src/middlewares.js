import moment from "moment-timezone";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import routes from "./routes";

const s3 = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});

const multerSampleImg = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "codespace-bentley", // FIXME: S3 버킷 생성 후 버킷명 맞춰주기
    key(req, file, cb) {
      cb(null, `sample/${Date.now() + file.originalname}`); // FIXME: S3 버킷 생성 후 `[폴더명]/${Date.now() + file.originalname}` 맞춰주기
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

const multerSampleDescImg = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "codespace-bentley", // FIXME: S3 버킷 생성 후 버킷명 맞춰주기
    key(req, file, cb) {
      cb(null, `sample/desc/${Date.now() + file.originalname}`); // FIXME: S3 버킷 생성 후 `[폴더명]/${Date.now() + file.originalname}` 맞춰주기
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

// 한 개의 input(type="file")일 경우
export const uploadSampleImg = multerSampleImg.single("thumbnail");
export const uploadSampleDescImg = multerSampleDescImg.single("sampleDescImg");
// 여러 input(type="file")일 경우
// export const uploadSampleImg = multerSampleImg.fields([{ name: "thumbnail1" }, { name: "thumbnail2" }]);

export const localsMiddleware = (req, res, next) => {
  // FIXME: 개발 모드, 실 서버 배포 시 prod로 변경 必
  const mode = "dev";
  res.locals = {
    // --------------------- VARIABLES ---------------------
    // FIXME: 홈페이지 이름 수정 必
    siteName: "SITE NAME",
    routes,
    loggedUser: req.user || null,
    currentYear: new Date().getFullYear().toString(),
    currentUrl: req.url,
    // 랜덤 이미지 URL
    randomImg: "https://picsum.photos/300",
    // 이미지 파일 경로
    imgPath: "/images",
    // 외부 링크 URL
    naverLink: "https://www.naver.com/",
    instagramLink: "https://www.instagram.com/",
    youtubeLink: "https://www.youtube.com/",
    // 캐시 삭제 방지용 Date Query
    versionDateQuery: new Date().getTime(),
    // ----------------------- REGEX -----------------------
    // --------------------- FUNCTIONS ---------------------
    // 시간 계산
    calcMomentTZ: (time) => {
      let calcTime;
      if (mode === "dev") {
        calcTime = moment(time);
      } else if (mode === "prod") {
        calcTime = moment(time).subtract(9, "hours");
      }
      return calcTime;
    },
    // 세자리 수마다 콤마 추가
    addComma: (number) => {
      const regexp = /\B(?=(\d{3})+(?!\d))/g;
      return number.toString().replace(regexp, ",");
    },
    // 날짜 형식 변환
    dateFormatYMD: (date) => moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"),
    dateFormatYMDHm: (date) => moment(date).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm"),
    dateFormatYMDHms: (date) => moment(date).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
    // 해당하는 문자열 모두 치환
    replaceAll: (str, searchStr, replaceStr) => str.split(searchStr).join(replaceStr),
    // 배열 Random 섞기
    shuffleArray: (arr) => {
      for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
      return arr;
    },
    // 배열에 특정 문자열 포함되어 있는지 체크하는 함수
    arrIncludesStr: (arr, str) => {
      const arr2 = arr.map((x) => String(x._id));
      return arr2.includes(str);
    },
  };
  next();
};

// --- 접근 권한 설정 ---
// 비회원만 접근 가능
export const onlyPublic = (req, res, next) => {
  try {
    if (req.user) {
      res.send(
        `<script>alert("잘못된 접근입니다."); \
        location.href="${routes.home}"</script>`
      );
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("알 수 없는 오류가 발생하였습니다."); \
      location.href="${routes.home}"</script>`
    );
  }
};
// 회원만 접근 가능
export const onlyUser = (req, res, next) => {
  try {
    if (req.user) {
      next();
    } else {
      res.send(
        `<script>alert("잘못된 접근입니다."); \
        location.href="${routes.home}"</script>`
      );
    }
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("알 수 없는 오류가 발생하였습니다."); \
      location.href="${routes.home}"</script>`
    );
  }
};
// 관리자만 접근 가능
export const onlyAdmin = (req, res, next) => {
  try {
    if (req.user) {
      if (req.user.role === "master" || req.user.role === "admin") {
        next();
      } else {
        res.send(
          `<script>alert("관리자 권한이 필요합니다."); \
          location.href="${routes.home}"</script>`
        );
      }
    } else {
      res.send(
        `<script>alert("관리자 로그인이 필요합니다."); \
        location.href="${routes.admin}"</script>`
      );
    }
  } catch (err) {
    console.log(err);
    res.send(
      `<script>alert("알 수 없는 오류가 발생하였습니다."); \
      location.href="${routes.home}"</script>`
    );
  }
};
