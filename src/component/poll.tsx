export default function Poll({ data }: any) {
  //여기에 투표 구현

  //   const localStorager = () => {
  //     let prompt = window.prompt(
  //       '티어표의 이름을 정해주세요 \nName your tierlist',
  //     );
  //     while (prompt == 'namedb') {
  //       prompt = window.prompt(
  //         '다른 이름으로 정해주세요 \nPlease choose different name',
  //       );
  //     }
  //     if (!prompt) return;
  //     if (localStorage.getItem('namedb')) {
  //       let namedb = JSON.parse(localStorage.getItem('namedb') as string);
  //       for (let i = 0; i < namedb.length; i++) {
  //         if (namedb[i] == prompt) {
  //           let howyoudo;
  //           if (prompt == namedb[i]) {
  //             howyoudo = window.confirm(
  //               '같은 이름의 세이브 데이터에 덮어 씌우겠습니까? \nOverride on same name data?',
  //             );
  //           }
  //           if (!howyoudo) return;
  //           break;
  //         }
  //       }
  //       //   namedb.push(prompt);
  //       if (!namedb.includes(prompt)) {
  //         namedb.push(prompt);
  //       }
  //       localStorage.setItem('namedb', JSON.stringify(namedb));
  //       if (localStorage.getItem(prompt)) {
  //         localStorage.removeItem(prompt);
  //       }
  //       localStorage.setItem(prompt, JSON.stringify(tierList));
  //     } else {
  //       let namedb = [prompt];
  //       localStorage.setItem('namedb', JSON.stringify(namedb));
  //       localStorage.setItem(prompt, JSON.stringify(tierList));
  //     }
  //     dbloader();
  //   };
  console.log(data);
  return (
    data && (
      <div className="m-16">
        <div className="text-6xl">{data.title}</div>
      </div>
    )
  );
}
