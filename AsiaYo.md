# 題目一

### 一條查詢 SQL

```
select p.id, p.name, sum(o.price) as price
from asia_yo.orders as o
         left join asia_yo.rooms as r
                   on o.room_id = r.id
         left join asia_yo.properties p on r.property_id = p.id
where o.created_at < '2021-02-01 00:00:00'
group by property_id, p.name
order by price desc
limit 10;


# 如果以上有時區問題則需要再調整 sql 時間的語法
```

### 使用的資料庫

mysql

### 建立資料表的 SQL

```
CREATE DATABASE asia_yo;


CREATE TABLE asia_yo.properties
(
    `id`   varchar(50) NOT NULL DEFAULT (uuid()),
    `name` varchar(50) NOT NULL
);


CREATE TABLE asia_yo.rooms
(
    `id`          varchar(50) NOT NULL DEFAULT (uuid()),
    `property_id` varchar(50) NOT NULL,
    `name`        varchar(50) NOT NULL
);


CREATE TABLE asia_yo.orders
(
    `id`         varchar(50)             NOT NULL DEFAULT (uuid()),
    `room_id`    varchar(50)             NOT NULL,
    `price`      decimal(12, 2) UNSIGNED NOT NULL DEFAULT 0,
    `created_at` datetime                NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 如何調整資料表結構

```
1. 於 room_id 與 property_id 加 Foreign Key

2. 將 property_id 也存入 orders 另要查旅宿的 sql 可以略過 join 房間的 table
- 訂單資料表 (orders)：id, room_id, price, created_at

3. 如果月報表是重要資料可以將月份的資料分開並且存入 orders table 內
- 訂單資料表 (orders)：id, room_id, price, created_at, property_id, month

4. 將 orders.month 欄位下 index

5. 將部分重要且常用的財務報表分開 table 紀錄
```

# 題目二

```
如果資料查詢速度過慢
1. 應該先對常被查詢組合重點資料下 index

2. 資料再細分出幾個報表 table 或如上題的資料結構先做調整

3. 檢查看 table 的資料量是否過大，如果 table 資料量過大，可考慮 table sharding 可按照國籍或者地區做 sharding

4. 如果月報表是常態需要的營運數據的話，可建議新增一個非同步的 table 用 nats-streaming 等同步，此 table 將資料表設計為如下
- 旅宿房間當月報表 (property_room_revenue)：id, property_id, room_id, month, price

5. 如果微微服務架構的話可拆分一顆 service且再細分
- 旅宿當月報表 (property_revenue)：id, property_id, property_name, month, price,
- 房間當月報表 (room_revenue)：id, property_id, room_id, room_name, month, price

6. 用 redis 加快存取速度，把已經經過的月份如果查詢過後都可先存在 redis 內，因為經過月份的報表不太會改變
```

# 實作

#### implementation list

- [x] husky
- [x] lint-staged
- [x] conventional-commit-commitizen
- [x] sametic-release
- [x] github action
- [x] unit test
- [x] e2e test
- [x] testing in docker
- [x] unit test when commit
- [x] e2e test in github action
- [x] revonate bot
- [x] api doc
- [ ] exchange currency implementation
- [ ] build service in docker
- [ ] build docker service when github action
- [ ] env file
- [ ] log system
- [ ] 用 redis 加快存取速度
