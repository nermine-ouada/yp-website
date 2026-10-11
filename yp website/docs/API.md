# YP Board API

End-to-end documentation for every endpoint of YP Board. It follows the same folders and requests as the Postman collection `[postman/ypboard.postman_collection.json](../postman/ypboard.postman_collection.json)`.

## Variables


| Variable        | Initial value                              | Description                                                              |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| `baseUrl`       | `https://ieee-yp-opportunities.vercel.app` | API base URL                                                             |
| `adminPassword` |                                            | Admin password. Set it in the *Current value* column                     |
| `oppId`         |                                            | Opportunity id, read from the admin pages                                |
| `actionId`      |                                            | Server Action id, read from the page's form (it changes on every deploy) |


## Authorization

**Type:** Cookie

`POST /admin/login` sets the cookie `admin_session`. Send it on every request marked 🔒. A session lasts **15 minutes**.

Without a valid cookie:

- `GET` requests to `/admin/*` return `307` → `/admin/login?from=<path>`.
- `POST` requests to `/admin/*` fail.

## Headers used on every POST


| Key            | Value                 | Description                                                                   |
| -------------- | --------------------- | ----------------------------------------------------------------------------- |
| `Origin`       | `{{baseUrl}}`         | Required. Next.js rejects a Server Action whose origin doesn't match the host |
| `Content-Type` | `multipart/form-data` | Required. URL-encoded bodies are not supported                                |


## About `$ACTION_ID_…`

**For integrations, use the [Public API](#-0-public-api).** The admin endpoints (folders 2 to 6) are Next.js Server Actions built for the admin web pages, not for automation tools.

Every `POST` below except **bulkCreateOpportunities** is a Next.js Server Action submitted as a form. The body must contain the form's hidden field `$ACTION_ID_{{actionId}}`, which has an empty value. The id changes on every deploy, so read it from the page listed under **Get action id from**. Copy the form's hidden inputs exactly as they appear. The Postman collection does this automatically.

Each Server Action responds with `303 See Other`, and the `Location` header gives the next page.

---

# 📁 0. Public API

A stable JSON endpoint for external integrations. No authorization, no action IDs and no cookies are needed. It's read-only.

## GET List opportunities

```
GET {{baseUrl}}/api/opportunities
```

Returns every opportunity on the public board as JSON, with optional filters. Trashed and hidden opportunities are never returned. Results are sorted by `sheet`, then by board order.

**Query params** (all optional, and they can be combined)


| Key            | Example                | Description                                                |
| -------------- | ---------------------- | ---------------------------------------------------------- |
| `q`            | `ieee`                 | Search in title, category, level, who and notes            |
| `sheet`        | `Internships`          | Board tab                                                  |
| `category`     | `Fellowship`           | Sub-category                                               |
| `level`        | `Graduate`             | Study level                                                |
| `status`       | `Open`                 | Status                                                     |
| `membership`   | `required`             | IEEE membership                                            |
| `deadline`     | `March`                | Deadline text                                              |
| `updatedSince` | `2026-10-01T00:00:00Z` | Only rows created or edited at or after this ISO 8601 date |
| `limit`        | `50`                   | Page size, from 1 to 500. Default `500`                    |
| `offset`       | `0`                    | Rows to skip. Default `0`                                  |


**How filters match**

- Text filters are **case-insensitive "contains"** matches, so `level=graduate` matches `Graduate`, `Undergraduate/Graduate`, and so on.
- To match **any** of several values, **repeat the param**: `?level=Graduate&level=PhD`. Values aren't split on commas, because some values contain commas.
- Different params combine with **AND**.

**Example request**

```bash
curl '{{baseUrl}}/api/opportunities?sheet=Scholarships&status=open&limit=2'
```

**Example response** `200 OK`

```json
{
  "status": 200,
  "headers": {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store"
  },
  "body": {
    "total": 5,
    "count": 2,
    "limit": 2,
    "offset": 0,
    "data": [
      {
        "id": "cmfs0k2a40001l804abcd1234",
        "sheet": "Scholarships",
        "title": "IEEE PES Scholarship Plus Initiative",
        "category": "Scholarship",
        "level": "Undergraduate",
        "who": "…",
        "award": "…",
        "deadline": "…",
        "status": "Open",
        "membership": "Yes : required",
        "notes": "",
        "link": "https://...",
        "createdAt": "2026-09-20T13:06:07.995Z",
        "updatedAt": "2026-09-20T13:06:07.995Z"
      }
    ]
  }
}
```


| Field             | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| `total`           | Number of rows matching the filters, ignoring `limit`/`offset` |
| `count`           | Number of rows in this response                                |
| `limit`, `offset` | The paging values that were applied                            |
| `data`            | The opportunities                                              |


**Example response** `400 Bad Request` (invalid param)

```json
{ "error": "limit must be an integer between 1 and 500" }
```

**Example response** `500 Internal Server Error`

```json
{ "error": "Internal server error" }
```

**Paging:** keep requesting with `offset = offset + limit` while `offset + count < total`.

### Using it from an external integration

- **Request:** `GET https://ieee-yp-opportunities.vercel.app/api/opportunities`, with no authentication.
- **Filters:** send them as query parameters. To match several values, send the same parameter more than once.
- **Results:** the opportunities are in the `data` array.
- **New or changed items:** on a schedule, pass `updatedSince` = the time of the last run (ISO 8601).
- **Deletions:** a deleted opportunity simply stops appearing. `updatedSince` won't report it, so compare ids if you need to detect removals.

---

# 📁 1. Public & access control

No authorization needed.

## GET Public board

```
GET {{baseUrl}}/
```

Returns the public board as an HTML page, with every opportunity that isn't hidden or in the trash.

**Example request**

```bash
curl --location '{{baseUrl}}/'
```

**Example response** `200 OK`

```json
{
  "status": 200,
  "headers": {
    "Content-Type": "text/html; charset=utf-8"
  }
}
```

## GET Admin without session

```
GET {{baseUrl}}/admin
```

Checks that the admin portal can't be reached without logging in.

**Example request**

```bash
curl '{{baseUrl}}/admin'
```

**Example response** `307 Temporary Redirect`

```json
{
  "status": 307,
  "headers": {
    "Location": "/admin/login?from=%2Fadmin"
  },
  "body": null
}
```

---

# 📁 2. Auth

## POST Login

```
POST {{baseUrl}}/admin/login
```

Logs in with the shared admin password and sets the session cookie.

**Get action id from:** `GET {{baseUrl}}/admin/login`

**Body** `form-data`


| Key                       | Value               | Description                   |
| ------------------------- | ------------------- | ----------------------------- |
| `$ACTION_ID_{{actionId}}` |                     | Server Action reference       |
| `password`                | `{{adminPassword}}` | Admin password                |
| `from`                    | `/admin`            | Page to return to after login |


**Example request**

```bash
curl '{{baseUrl}}/admin/login' \
  -H 'Origin: {{baseUrl}}' \
  -c cookies.txt \
  -F '$ACTION_ID_{{actionId}}=' \
  -F 'password={{adminPassword}}' \
  -F 'from=/admin'
```

**Example response** `303 See Other` (success)

```json
{
  "status": 303,
  "headers": {
    "Location": "/admin",
    "Set-Cookie": "admin_session=1791234567.3f9a…; Path=/; HttpOnly; Secure; SameSite=lax; Max-Age=900"
  },
  "body": null
}
```

**Example response** `303 See Other` (wrong password)

```json
{
  "status": 303,
  "headers": {
    "Location": "/admin/login?error=1&from=%2Fadmin"
  },
  "body": null
}
```

## POST Logout

```
POST {{baseUrl}}/admin
```

Clears the session cookie.

**Get action id from:** `GET {{baseUrl}}/admin` (the "Log out" form)

**Body** `form-data`


| Key                       | Value | Description             |
| ------------------------- | ----- | ----------------------- |
| `$ACTION_ID_{{actionId}}` |       | Server Action reference |


**Example request**

```bash
curl '{{baseUrl}}/admin' \
  -H 'Origin: {{baseUrl}}' \
  -b cookies.txt -c cookies.txt \
  -F '$ACTION_ID_{{actionId}}='
```

**Example response** `303 See Other`

```json
{
  "status": 303,
  "headers": {
    "Location": "/admin/login",
    "Set-Cookie": "admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  },
  "body": null
}
```

---

# 📁 3. Import template

## GET Download template 🔒

```
GET {{baseUrl}}/admin/import/template
```

Downloads the Excel template for bulk import. It has one header row and one example row, which you should delete before importing.

**Example request**

```bash
curl '{{baseUrl}}/admin/import/template' -b cookies.txt -o template.xlsx
```

**Example response** `200 OK`

The response is an `.xlsx` file. Its contents, shown as JSON:

```json
{
  "status": 200,
  "headers": {
    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Content-Disposition": "attachment; filename=\"yp-board-import-template.xlsx\""
  },
  "body": [
    {
      "sheet": "Scholarships",
      "title": "IEEE Example Society Scholarship",
      "category": "Scholarship",
      "level": "Undergraduate",
      "who": "IEEE student members, any engineering field, GPA ≥ 3.0.",
      "award": "$1,000",
      "deadline": "March 31 annually",
      "status": "Open",
      "membership": "Yes",
      "notes": "Delete this example row before importing.",
      "link": "https://example.com"
    }
  ]
}
```

---

# 📁 4. Opportunities

## Opportunity fields

The create and update requests use these body fields. The admin UI marks all of them as required except `notes`, but **the server doesn't validate them**.


| Key          | Example value                      | Description                                                     |
| ------------ | ---------------------------------- | --------------------------------------------------------------- |
| `sheet`      | `Scholarships`                     | Board tab: `Scholarships`, `PhD & Fellowships` or `Internships` |
| `title`      | `IEEE Example Society Scholarship` | Title                                                           |
| `category`   | `Scholarship`                      | Sub-category label                                              |
| `level`      | `Undergraduate`                    | Study level                                                     |
| `who`        | `IEEE student members, GPA ≥ 3.0`  | Who qualifies                                                   |
| `award`      | `$1,000`                           | Award or value                                                  |
| `deadline`   | `March 31 annually`                | Deadline (free text)                                            |
| `status`     | `Open`                             | Status                                                          |
| `membership` | `Yes`                              | Whether IEEE membership is required                             |
| `notes`      | `Renewable for 2 years`            | Optional notes                                                  |
| `link`       | `https://example.com`              | Link to the opportunity                                         |


## POST Create opportunity 🔒

```
POST {{baseUrl}}/admin/new
```

Creates an opportunity.

**Get action id from:** `GET {{baseUrl}}/admin/new`

**Body** `form-data`


| Key                                             | Value |
| ----------------------------------------------- | ----- |
| `$ACTION_ID_{{actionId}}`                       |       |
| *all [opportunity fields](#opportunity-fields)* |       |


**Example request**

```bash
curl '{{baseUrl}}/admin/new' \
  -H 'Origin: {{baseUrl}}' \
  -b cookies.txt \
  -F '$ACTION_ID_{{actionId}}=' \
  -F 'sheet=Scholarships' \
  -F 'title=IEEE Example Society Scholarship' \
  -F 'category=Scholarship' \
  -F 'level=Undergraduate' \
  -F 'who=IEEE student members, GPA ≥ 3.0' \
  -F 'award=$1,000' \
  -F 'deadline=March 31 annually' \
  -F 'status=Open' \
  -F 'membership=Yes' \
  -F 'notes=' \
  -F 'link=https://example.com'
```

**Example response** `303 See Other`

```json
{
  "status": 303,
  "headers": {
    "Location": "/admin"
  },
  "body": null
}
```

## POST Update opportunity 🔒

```
POST {{baseUrl}}/admin/{{oppId}}
```

Replaces every field of an opportunity.

**Get action id from:** `GET {{baseUrl}}/admin/{{oppId}}`

This form uses a *bound* action, so the opportunity id travels in hidden fields named `$ACTION_REF_…` and `$ACTION_…:0`, `$ACTION_…:1` instead of `$ACTION_ID_…`. Copy them from the page exactly as they are.

**Body** `form-data`


| Key                                             | Value         |
| ----------------------------------------------- | ------------- |
| `$ACTION_REF_…`                                 | *(from page)* |
| `$ACTION_…:0`                                   | *(from page)* |
| `$ACTION_…:1`                                   | *(from page)* |
| *all [opportunity fields](#opportunity-fields)* |               |


**Example response** `303 See Other`

```json
{
  "status": 303,
  "headers": {
    "Location": "/admin"
  },
  "body": null
}
```

## POST Show or hide opportunity 🔒

```
POST {{baseUrl}}/admin
```

Hides an opportunity from the public board, the `/links` count and the Public API, or shows it again. A hidden opportunity stays in the admin dashboard, where it's marked **Hidden**. Nothing is deleted.

**Get action id from:** `GET {{baseUrl}}/admin` (the row's "Hide" or "Show" form)

**Body** `form-data`

| Key | Value | Description |
| --- | --- | --- |
| `$ACTION_ID_{{actionId}}` | | Server Action reference |
| `id` | `{{oppId}}` | Opportunity id |
| `hidden` | `true` | `true` to hide, `false` to show |

**Example request**

```bash
curl '{{baseUrl}}/admin'   -H 'Origin: {{baseUrl}}'   -b cookies.txt   -F '$ACTION_ID_{{actionId}}='   -F 'id={{oppId}}'   -F 'hidden=true'
```

**Example response** `200 OK`

This action doesn't redirect. It re-renders the admin dashboard, so the admin's current search and filters are kept.

```json
{
  "status": 200,
  "headers": {
    "Content-Type": "text/html; charset=utf-8"
  },
  "body": "<!DOCTYPE html>… (the admin dashboard)"
}
```

## POST Move to trash 🔒

```
POST {{baseUrl}}/admin
```

Soft-deletes an opportunity. It disappears from the public board but can still be recovered.

**Get action id from:** `GET {{baseUrl}}/admin` (the row's "Delete" form)

**Body** `form-data`


| Key                       | Value       | Description             |
| ------------------------- | ----------- | ----------------------- |
| `$ACTION_ID_{{actionId}}` |             | Server Action reference |
| `id`                      | `{{oppId}}` | Opportunity id          |


**Example request**

```bash
curl '{{baseUrl}}/admin' \
  -H 'Origin: {{baseUrl}}' \
  -b cookies.txt \
  -F '$ACTION_ID_{{actionId}}=' \
  -F 'id={{oppId}}'
```

**Example response** `303 See Other`

```json
{
  "status": 303,
  "headers": {
    "Location": "/admin"
  },
  "body": null
}
```

## POST Recover from trash 🔒

```
POST {{baseUrl}}/admin/trash
```

Moves an opportunity from the trash back to the board.

**Get action id from:** `GET {{baseUrl}}/admin/trash` (the row's "Recover" form)

**Body** `form-data`


| Key                       | Value       | Description             |
| ------------------------- | ----------- | ----------------------- |
| `$ACTION_ID_{{actionId}}` |             | Server Action reference |
| `id`                      | `{{oppId}}` | Opportunity id          |


**Example response** `303 See Other`

```json
{
  "status": 303,
  "headers": {
    "Location": "/admin/trash"
  },
  "body": null
}
```

## POST Delete permanently 🔒

```
POST {{baseUrl}}/admin/trash
```

⚠️ Permanently deletes one opportunity. This can't be undone. The server doesn't check that the row is in the trash.

**Get action id from:** `GET {{baseUrl}}/admin/trash` (the row's "Delete permanently" form)

**Body** `form-data`


| Key                       | Value       | Description             |
| ------------------------- | ----------- | ----------------------- |
| `$ACTION_ID_{{actionId}}` |             | Server Action reference |
| `id`                      | `{{oppId}}` | Opportunity id          |


**Example response** `303 See Other`

```json
{
  "status": 303,
  "headers": {
    "Location": "/admin/trash"
  },
  "body": null
}
```

---

# 📁 5. Bulk import

## POST Bulk create opportunities 🔒

```
POST {{baseUrl}}/admin/import
```

Creates many opportunities in one call, saved in the order you send them. This action has no form, so it's called with a `Next-Action` header instead of form-data.

**Get action id from:** the JS files loaded by `GET {{baseUrl}}/admin/import`. Search them for `createServerReference)("<id>", …, "bulkCreateOpportunities")`.

**Headers**


| Key            | Value                      |
| -------------- | -------------------------- |
| `Next-Action`  | `{{actionId}}`             |
| `Content-Type` | `text/plain;charset=UTF-8` |
| `Accept`       | `text/x-component`         |
| `Origin`       | `{{baseUrl}}`              |


**Body** `raw (JSON)`: an array of arguments. The only argument is the array of rows, each using the [opportunity fields](#opportunity-fields).

⚠️ **Escape `$`:** the body uses React's argument format, where a string starting with `$` is a reference to another value. Write any value that starts with `$` with a doubled `$$`. For example, send `"award": "$$1,000"` to store `$1,000`. If you don't, the request fails with a `500` error.

```json
[
  [
    {
      "sheet": "Internships",
      "title": "IEEE Example Internship",
      "category": "Internship",
      "level": "Graduate",
      "who": "IEEE graduate student members",
      "award": "Paid",
      "deadline": "June 1",
      "status": "Open",
      "membership": "Yes",
      "notes": "",
      "link": "https://example.com"
    }
  ]
]
```

**Example request**

```bash
curl '{{baseUrl}}/admin/import' \
  -H 'Origin: {{baseUrl}}' \
  -H 'Next-Action: {{actionId}}' \
  -H 'Content-Type: text/plain;charset=UTF-8' \
  -H 'Accept: text/x-component' \
  -b cookies.txt \
  --data-raw '[[{"sheet":"Internships","title":"IEEE Example Internship","category":"Internship","level":"Graduate","who":"IEEE graduate student members","award":"Paid","deadline":"June 1","status":"Open","membership":"Yes","notes":"","link":"https://example.com"}]]'
```

**Example response** `200 OK`

The raw body is a React Server Components payload whose last line is `1:{"count":1}`. The result it carries:

```json
{
  "status": 200,
  "headers": { "Content-Type": "text/x-component" },
  "body": { "count": 1 }
}
```

---

# 📁 6. ⚠️ Empty trash

## POST Empty trash 🔒

```
POST {{baseUrl}}/admin/trash
```

⚠️ Permanently deletes **every** opportunity in the trash. This can't be undone. In the Postman collection it's skipped unless `allowDestructive` is `true`.

**Get action id from:** `GET {{baseUrl}}/admin/trash` (the "Empty trash" form)

**Body** `form-data`


| Key                       | Value | Description             |
| ------------------------- | ----- | ----------------------- |
| `$ACTION_ID_{{actionId}}` |       | Server Action reference |


**Example response** `303 See Other`

```json
{
  "status": 303,
  "headers": {
    "Location": "/admin/trash"
  },
  "body": null
}
```

