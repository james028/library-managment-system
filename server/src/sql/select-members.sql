SELECT m.id,
       m.first_name  AS "firstName",
       m.last_name   AS "lastName",
       m.card_number AS "cardNumber",
       m.email,
       m.phone,
       m.status,
       m.created_at  AS "createdAt"

FROM members m
