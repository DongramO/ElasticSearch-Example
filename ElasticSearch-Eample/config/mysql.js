module.exports = {
  host: 'localhost',
  port: '3308', // mysql 포트
  user: 'root',
  password: 'password', // mysql 비밀번호
  database: 'database', // mysql 프로젝트이름
  connectionLimit: 23, // 커넥션 갯수를 23개로 제한 보통 default 로 23개 많이씀
}
