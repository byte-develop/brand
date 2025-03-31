import React, { useEffect, useState } from 'react'
import "./home.css"
import { Link, useLocation } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive';
import HomeItem from './HomeItem';
import HomeDescItem from './HomeDescItem';
import { toast } from 'react-toastify';
import { Player, ControlBar, BigPlayButton } from 'video-react';
import 'video-react/dist/video-react.css';


const Home = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [Data, setData] = useState([])

  useEffect(() => {
    const GetData = async () => {
      try {
        const response = await fetch('/api/home', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        setData(data);
        console.log(data)
      } catch (error) {

      }
    };
    GetData()
  }, []);

  return (
    <>
      {
        isMobile ?

          <div className='flex flex-col items-center mt-7 pb-40 relative'>
            <p className='font-[OB] text-[40px] text-transparent blur-[1px]' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>BRAND</p>
            <p className='text-[20px] text-transparent blur-[1px]' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>“У нас  есть всё, что тебе нужно”</p>
            <div className="mt-5 max-w-[1137px] flex flex-col items-center">
              <p className='text-[14px] font-[OL] text-center w-[90%]' style={{ whiteSpace: "normal" }}>Актуальные ссылки на наши чаты, нажмите на подходящую кнопку, и сайт <span style={{ position: 'relative', display: 'inline-block' }}>
                автоматически
                <span style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  height: '2px',
                  width: '100%',
                  background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)',
                  zIndex: -1,
                }} />
              </span> перенаправит вас.</p>
              <div className="h-[1px] w-[90%] bg-white mt-4 opacity-80"></div>
              <div className="w-[90%]">

                {
                  Data.length == 0 ?

                    <div className="flex items-center justify-center h-72 w-full">
                      <p className='text-white font-[OB] text-xl'>Ничего не найдено</p>
                    </div>

                    :

                    Data.map(data => (
                      <HomeItem
                        key={data.id}
                        name={data.name}
                        telegram={data.telegram}
                        element={data.element}
                      />
                    ))



                }
              </div>

              <div className="pr flex items-center relative justify-between h-9">
                <p style={{ whiteSpace: "normal" }} className='text-center w-[100%] px-3 text-[8px]'>Не понимаете, как пользоваться сайтом? Ниже для вас расположена инструкция.
                  А если всё же останутся вопросы, напишите администратору из раздела “Помощь”</p>
              </div>
              <div className="mt-2">
                <Link to={'/help'} className='h-[14px] rounded-full text-[10px] px-5 py-1' style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}>Помощь</Link>
              </div>

              <div className="w-full relative flex flex-col items-center">
                <div className="relative">
                  <div className="relative mt-7">
                    <div className="flex">
                      <p className='text-[20px] font-[OB]'> <span className='text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>КАК ИСПОЛЬЗОВАТЬ</span></p>
                      <span className='flex flex-col ml-2'>
                        <p className='text-[20px] font-[OB] bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'>САЙТ?</p>
                        <svg width="67" height="3" viewBox="0 0 67 3" fill="none" xmlns="http://www.w3.org/2000/svg" className=''>
                          <path d="M1 2.52148C8.83441 1.85101 16.6529 1.4182 24.4874 1.1619C31.8418 0.921298 37.4623 0.801482 44.7326 0.898905C52.0694 0.997218 58.8087 1.68098 65.9542 2.16651" stroke="url(#paint0_linear_432_101)" strokeWidth="0.843756" strokeLinecap="round" />
                          <defs>
                            <linearGradient id="paint0_linear_432_101" x1="-32.8181" y1="-0.980746" x2="-16.507" y2="38.1314" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#0C0056" />
                              <stop offset="0.421875" stopColor="#120082" />
                              <stop offset="0.729167" stopColor="#003AD1" />
                              <stop offset="0.931346" stopColor="#0C0056" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-[90%] mt-10 rounded-xl border border-white relative">
                <div className="rounded-[50px] w-full overflow-hidden">
                  <Player
                    src="../public/brand3.mp4"
                    className="w-full h-auto"
                    playsinline
                    webkit-playsinline
                    controls={false}
                  >
                    <ControlBar autoHide={true} />
                    <BigPlayButton position="center" />
                  </Player>
                </div>
              </div>

              <div className="mt-20 flex flex-col items-center text-[10px] w-[90%]">
                <p className='bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-[20px] font-[OB] text-transparent '>ПРАВИЛА <span style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>САЙТА</span></p>
                <div className="mt-5 w-full" style={{ whiteSpace: "normal" }}>
                  <p className='font-[OSB] text-[#003DD9] text-[14px]'>ОБЩИЕ ПРАВИЛА</p>
                  <p className='mt-3'>1. Обезопасьте свой аккаунт: поставьте двухфакторную аутентификацию на аккаунт и почту.</p>
                  <p>2. Уважайте пользователей сайта. Добавьте пользователя в черный список, если вам не нравится с ним общаться.
                    Запрещено упоминание родителей, родственников, членов семьи (в том числе отчима и мачехи) пользователя в сообщении, несущем негативный характер, либо в завуалированной форме их оскорбления. </p>
                  <p className='mt-3 text-[#003DD9]'>У Команды сайта есть право на блокировку пользователя, в случаях неоднократного неадекватного / неуважительного / оскорбительного отношения в адрес Пользователей сайта / Команды сайта. Жалоба на данные блокировки будет рассмотрена Администрацией сайта.</p>
                  <p className='mt-3'>3. Запрещены прямые или косвенные оскорбления Команды сайтов (Администратор, Главный модератор, Модератор, Разработчик, Дизайнер, Редактор),   / Чатов Telegram, Element , Session  сервера в личных сообщениях или по контактам, указанным в профиле. Обжалование действия Команды сайта рекомендуется делать в разделе Жалобы.</p>
                  <p>4. Запрещено использование никнеймов, содержащих оскорбления, уничижительные слова или дискриминацию.</p>
                  <p>5. На сайте имеется контент, предназначенный для лиц старше 18 лет.</p>
                  <p>6. На форуме существует раздел Гайды по форуму.</p>
                  <p>7. Сайт не придерживается определенной национальности, но на сайте принято общаться на русском языке.</p>
                  <p>8. Создание вторичного аккаунта разрешено, но участвовать в розыгрышах и получать раздачи можно только с одного аккаунта. Будут заблокированы все аккаунты, если это правило будет нарушено. Если один из аккаунтов заблокирован, то все остальные аккаунты могут быть заблокированы. Продажа профиля от этого форума запрещена.</p>
                  <p>9. Деаноны (в т. ч. угрозы, даже в шуточной форме) на форуме запрещены. Аналогично запрещены ссылки, ведущие на сайты, где опубликована личная информация о пользователях форума.</p>
                  <p>10. Аватары пользователей не должны содержать порнографические материалы, надписи, похожие цветом, текстом или формой на лычки командного состава (Администратор, Модератор и так далее).</p>
                  <p className='mt-3'>Администрация не несет ответственности за работоспособность сайта, прямые или косвенные убытки, возникшие вследствие его использования или не использования, а также технических сбоев.</p>
                  <p className='mt-3 text-[#003DD9]'>Администрация имеет право в одностороннем порядке заблокировать доступ любого пользователя к сайту, заблокировать и/или удалить аккаунт пользователя, отредактировать данные аккаунта пользователя, удалить с сайта любой материал, размещенный пользователем в одностороннем порядке без объяснения причин.</p>

                </div>
              </div>

              <div className="mt-5 w-[90%] flex flex-col items-center text-[10px]">
                <p className='bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-[20px] font-[OB] text-transparent '>ПРАВИЛА <span style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>ДЛЯ ПОКУПАТЕЛЕЙ</span></p>
                <div className="mt-5 w-full" style={{ whiteSpace: "normal" }}>
                  <p className=''>1. Покупатель, совершая покупку, соглашается с правилами магазина.</p>
                  <p>2. Покупателями, в сообщениях, не допускаются прямые оскорбления, нецензурная лексика, массовые рассылки.</p>
                  <p>3. Покупатель несёт ответственность за сохранность своих данных.</p>
                  <p>4. Покупателю запрещена передача аккаунта третьим лицам. Наказание - блокировка аккаунта.</p>
                  <p>5. Не допускаются прямые оскорбления, неуважительные высказывания, нецензурная лексика в сторону ресурса, его сотрудников, а так же пользоватей ресурса в личных и публичных сообщениях. Запрещены массовые рассылки как в публичных, так и в личных сообщениях.</p>
                  <p>6. Жалоба по подмене (недовес, качество вещества) товара рассматривается только при наличии видео распаковки товара.</p>
                  <p className='mt-3 text-[#003DD9]'>Если претензия относится к количеству товара, видео должно содержать следующую информацию в строго указанной последовательности:</p>
                  <p className='mt-3'>• Взвешивание монет для определения корректной калибровки весов.</p>
                  <p>• Распаковка и взвешивание товара на весах.</p>
                  <p className='mt-3 text-[#003DD9]'>Если претензия относится к качеству товара, видео должно содержать следующую информацию:</p>
                  <p className='mt-3'>•Распаковка товара, с последующим размещением вещества на однотонной темной поверхности в хорошем освещении.</p>
                  <p>•Если претензия относится к повреждению упаковки, видео должно быть снято на месте исполнения заказа.</p>
                  <p className='mt-3'>7. Запрещено оставлять любые ссылки в отзывах о заказе. Запрещено раскрывать детали, места и способы организации кладов. Наказание - вплоть до удаления аккаунта с ресурса без права на восстановление.</p>
                </div>
              </div>
            </div>
          </div>

          :

          <div className='flex flex-col items-center mt-8 relative'>

            <div className=" absolute left-0 top-[90vh]">
              <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full" style={{ boxShadow: "0px 0px 100px 120px rgba(0, 40, 184, 0.5)" }}></div>
            </div>
            <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute left-0 top-[105vh]" style={{ boxShadow: "0px 0px 100px 120px rgba(0, 40, 184, 0.5)" }}></div>


            <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute right-0 top-[190vh]" style={{ boxShadow: "0px 0px 100px 120px rgba(0, 40, 184, 0.5)" }}></div>
            <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute right-0 top-[200vh]" style={{ boxShadow: "0px 0px 100px 120px rgba(0, 40, 184, 0.5)" }}></div>
            <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute left-0 top-[275vh]" style={{ boxShadow: "0px 0px 100px 120px rgba(0, 40, 184, 0.5)" }}></div>

            <div className="bg-[#0028B8] bg-opacity-50 h-12 w-12 rounded-full absolute right-0 top-[330vh]" style={{ boxShadow: "0px 0px 100px 120px rgba(0, 40, 184, 0.5)" }}></div>
            <p className='font-[OB] text-[70px] text-transparent  blur-[2px] mt-14' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>BRAND</p>
            <p className='text-[40px] text-transparent blur-[2px]' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>“У нас  есть всё, что тебе нужно”</p>
            <div className="mt-20 max-w-[1137px] flex flex-col items-center mb-80">
              <p className='text-[20px]'>Актуальные ссылки на наши чаты, нажмите на подходящую кнопку, и сайт <span style={{ position: 'relative', display: 'inline-block' }}>
                автоматически
                <span style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  height: '2px',
                  width: '100%',
                  background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)',
                  zIndex: -1,
                }} />
              </span> перенаправит вас.</p>
              <div className="h-[1px] w-full bg-white mt-4 opacity-80"></div>
              <div className="w-full">
                {
                  Data.length == 0 ?

                    <div className="flex items-center justify-center h-72 w-full">
                      <p className='text-white font-[OB] text-xl'>Ничего не найдено</p>
                    </div>

                    :

                    Data.map(data => (
                      <HomeDescItem
                        key={data.id}
                        name={data.name}
                        telegram={data.telegram}
                        element={data.element}
                      />
                    ))



                }
              </div>

              <div className="pr flex items-center relative justify-between h-20 w-full">
                <p style={{ whiteSpace: "normal" }} className='ml-10 w-[70%] text-[17px]'>Не понимаете, как пользоваться сайтом? Ниже для вас расположена инструкция.
                  А если всё же останутся вопросы, напишите администратору из раздела “Помощь”</p>
                <div className="mr-10">
                  <Link to={'/help'} className='w-[223px] h-[44px] rounded-full text-[20px] px-10 py-3' style={{ background: 'linear-gradient(143deg, rgba(12,0,86,1) 0%, rgba(18,0,130,1) 40%, rgba(0,58,209,1) 73%, rgba(12,0,86,1) 93%)' }}>Помощь</Link>
                </div>
              </div>
              <div className="w-full relative">
                <p className='absolute right-0 mt-5'>*ПЕРЕД ИСПОЛЬЗОВАНИЕМ САЙТА ОЗНАКОМЬТЕСЬ С ЕГО <a href='#' className='text-[#1949c4;]'>ПРАВИЛАМИ</a></p>
                <div className="relative">
                  <div className="absolute right-0 mt-24">
                    <p className='text-[64px] font-[OB] bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent'> <span className='text-transparent' style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>КАК ИСПОЛЬЗОВАТЬ</span> САЙТ?</p>
                    <svg width="235" height="10" viewBox="0 0 235 10" fill="none" xmlns="http://www.w3.org/2000/svg" className='absolute right-0'>
                      <path d="M2 7.62988C29.8557 5.246 57.6575 3.73922 85.5184 2.88414C111.672 2.08147 131.66 1.70448 157.518 2.14854C183.613 2.59666 207.59 5.19888 233.009 7.07408" stroke="url(#paint0_linear_367_165)" strokeWidth="3" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="paint0_linear_367_165" x1="-118.316" y1="-5.69049" x2="-56.714" y2="137.522" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#0C0056" />
                          <stop offset="0.421875" stopColor="#120082" />
                          <stop offset="0.729167" stopColor="#003AD1" />
                          <stop offset="0.931346" stopColor="#0C0056" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-full mt-60 rounded-[50px] border-[3px] border-white relative">
                <div className="rounded-[50px] w-full overflow-hidden">
                  <Player
                    playsinline
                    webkit-playsinline
                    controls={false}
                    src="../public/brand3.mp4" className="w-full h-auto">
                    <ControlBar autoHide={true} />
                    <BigPlayButton position="center" />
                  </Player>
                </div>
              </div>

              <div className="mt-20 w-full flex flex-col items-center ">
                <p className='bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-[64px] font-[OB] text-transparent '>ПРАВИЛА <span style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>САЙТА</span></p>
                <div className="mt-12 w-full" style={{ whiteSpace: "normal" }}>
                  <p className='font-[OSB] bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-transparent text-[22px]'>ОБЩИЕ ПРАВИЛА</p>
                  <p className='mt-7'>1. Обезопасьте свой аккаунт: поставьте двухфакторную аутентификацию на аккаунт и почту.</p>
                  <p>2. Уважайте пользователей сайта. Добавьте пользователя в черный список, если вам не нравится с ним общаться.
                    Запрещено упоминание родителей, родственников, членов семьи (в том числе отчима и мачехи) пользователя в сообщении, несущем негативный характер, либо в завуалированной форме их оскорбления. </p>
                  <p className='mt-7 text-[#003DD9]'>У Команды сайта есть право на блокировку пользователя, в случаях неоднократного неадекватного / неуважительного / оскорбительного отношения в адрес Пользователей сайта / Команды сайта. Жалоба на данные блокировки будет рассмотрена Администрацией сайта.</p>
                  <p className='mt-7'>3. Запрещены прямые или косвенные оскорбления Команды сайтов (Администратор, Главный модератор, Модератор, Разработчик, Дизайнер, Редактор),   / Чатов Telegram, Element , Session  сервера в личных сообщениях или по контактам, указанным в профиле. Обжалование действия Команды сайта рекомендуется делать в разделе Жалобы.</p>
                  <p>4. Запрещено использование никнеймов, содержащих оскорбления, уничижительные слова или дискриминацию.</p>
                  <p>5. На сайте имеется контент, предназначенный для лиц старше 18 лет.</p>
                  <p>6. На форуме существует раздел Гайды по форуму.</p>
                  <p>7. Сайт не придерживается определенной национальности, но на сайте принято общаться на русском языке.</p>
                  <p>8. Создание вторичного аккаунта разрешено, но участвовать в розыгрышах и получать раздачи можно только с одного аккаунта. Будут заблокированы все аккаунты, если это правило будет нарушено. Если один из аккаунтов заблокирован, то все остальные аккаунты могут быть заблокированы. Продажа профиля от этого форума запрещена.</p>
                  <p>9. Деаноны (в т. ч. угрозы, даже в шуточной форме) на форуме запрещены. Аналогично запрещены ссылки, ведущие на сайты, где опубликована личная информация о пользователях форума.</p>
                  <p>10. Аватары пользователей не должны содержать порнографические материалы, надписи, похожие цветом, текстом или формой на лычки командного состава (Администратор, Модератор и так далее).</p>
                  <p className='mt-7'>Администрация не несет ответственности за работоспособность сайта, прямые или косвенные убытки, возникшие вследствие его использования или не использования, а также технических сбоев.</p>
                  <p className='mt-7 text-[#003DD9]'>Администрация имеет право в одностороннем порядке заблокировать доступ любого пользователя к сайту, заблокировать и/или удалить аккаунт пользователя, отредактировать данные аккаунта пользователя, удалить с сайта любой материал, размещенный пользователем в одностороннем порядке без объяснения причин.</p>

                </div>
              </div>

              <div className="mt-20 w-full flex flex-col items-center">
                <p className='bg-gradient-to-b from-[#0c0056] via-[#003ad1] to-[#0c0056] bg-clip-text text-[64px] font-[OB] text-transparent '>ПРАВИЛА <span style={{ backgroundImage: "url(../ShopDetailBG.png)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>ДЛЯ ПОКУПАТЕЛЕЙ</span></p>
                <div className="mt-12 w-full" style={{ whiteSpace: "normal" }}>
                  <p className=''>1. Покупатель, совершая покупку, соглашается с правилами магазина.</p>
                  <p>2. Покупателями, в сообщениях, не допускаются прямые оскорбления, нецензурная лексика, массовые рассылки.</p>
                  <p>3. Покупатель несёт ответственность за сохранность своих данных.</p>
                  <p>4. Покупателю запрещена передача аккаунта третьим лицам. Наказание - блокировка аккаунта.</p>
                  <p>5. Не допускаются прямые оскорбления, неуважительные высказывания, нецензурная лексика в сторону ресурса, его сотрудников, а так же пользоватей ресурса в личных и публичных сообщениях. Запрещены массовые рассылки как в публичных, так и в личных сообщениях.</p>
                  <p>6. Жалоба по подмене (недовес, качество вещества) товара рассматривается только при наличии видео распаковки товара.</p>
                  <p className='mt-7 text-[#003DD9]'>Если претензия относится к количеству товара, видео должно содержать следующую информацию в строго указанной последовательности:</p>
                  <p className='mt-7'>• Взвешивание монет для определения корректной калибровки весов.</p>
                  <p>• Распаковка и взвешивание товара на весах.</p>
                  <p className='mt-7 text-[#003DD9]'>Если претензия относится к качеству товара, видео должно содержать следующую информацию:</p>
                  <p className='mt-7'>•Распаковка товара, с последующим размещением вещества на однотонной темной поверхности в хорошем освещении.</p>
                  <p>•Если претензия относится к повреждению упаковки, видео должно быть снято на месте исполнения заказа.</p>
                  <p className='mt-7'>7. Запрещено оставлять любые ссылки в отзывах о заказе. Запрещено раскрывать детали, места и способы организации кладов. Наказание - вплоть до удаления аккаунта с ресурса без права на восстановление.</p>
                </div>
              </div>
            </div>
          </div>

      }
    </>
  )
}

export default Home