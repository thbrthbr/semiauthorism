# 체크할 거

보드 구현하기

뒤로가기 이렇게 바꿀까 고민 중
해결법 1: 이전 URL을 수동으로 저장해서 이동

1. 페이지 A에서 → 페이지 B로 올 때 query나 state로 전달

Next.js에서는 이렇게 한다:

👉 A에서 B로 이동할 때:
router.push(`/b?from=${encodeURIComponent(router.asPath)}`);

👉 B에서 뒤로 갈 때:
const searchParams = useSearchParams();
const from = searchParams.get('from');

router.push(from ?? '/');
