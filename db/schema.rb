# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151230214847) do

  create_table "for_selects", force: :cascade do |t|
    t.string   "code"
    t.string   "value"
    t.string   "text"
    t.string   "grouper"
    t.integer  "option_order", precision: 38
    t.string   "facility"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "for_selects", ["code"], name: "index_for_selects_on_code"
  add_index "for_selects", ["facility", "code"], name: "facility-code"
  add_index "for_selects", ["facility"], name: "index_for_selects_on_facility"

  create_table "mx_assessments", force: :cascade do |t|
    t.string   "danger_yn"
    t.string   "drugs_last_changed"
    t.string   "drugs_not_why",         limit: 4000
    t.string   "drugs_change_why",      limit: 4000
    t.string   "psychsoc_last_changed"
    t.string   "psychsoc_not_why",      limit: 4000
    t.string   "psychsoc_change_why",   limit: 4000
    t.datetime "meeting_date"
    t.integer  "patient_id",                         precision: 38
    t.string   "pre_date_yesno"
    t.string   "pre_date_no_why",       limit: 4000
    t.datetime "pre_date"
    t.string   "updated_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "ns_groups", force: :cascade do |t|
    t.string   "duration"
    t.string   "groupname"
    t.string   "leader"
    t.string   "groupsite"
    t.string   "facility"
    t.string   "updated_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "ns_groups", ["facility", "groupname"], name: "facility-groupname"
  add_index "ns_groups", ["facility"], name: "index_ns_groups_on_facility"

  create_table "ns_groups_patients", id: false, force: :cascade do |t|
    t.integer "ns_group_id", precision: 38, null: false
    t.integer "patient_id",  precision: 38, null: false
  end

  add_index "ns_groups_patients", ["ns_group_id", "patient_id"], name: "ns-patient-id", unique: true
  add_index "ns_groups_patients", ["patient_id", "ns_group_id"], name: "patient-ns-id", unique: true

  create_table "ns_notes", force: :cascade do |t|
    t.integer  "ns_group_id",           precision: 38
    t.integer  "patient_id",            precision: 38
    t.string   "participate"
    t.string   "respond"
    t.string   "interact_leader"
    t.string   "interact_peers"
    t.string   "discussion_init"
    t.string   "discussion_understand"
    t.text     "comment"
    t.string   "updated_by"
    t.datetime "group_date"
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
  end

  add_index "ns_notes", ["group_date"], name: "nsnote-groupdate"
  add_index "ns_notes", ["ns_group_id", "group_date"], name: "nsnote-groupid-date"
  add_index "ns_notes", ["ns_group_id"], name: "nsnote-groupid"
  add_index "ns_notes", ["patient_id", "ns_group_id"], name: "nsnote-patid-groupid"
  add_index "ns_notes", ["patient_id"], name: "nsnote-patientid"

  create_table "patients", force: :cascade do |t|
    t.string   "firstname"
    t.string   "lastname"
    t.string   "identifier"
    t.string   "facility"
    t.string   "site"
    t.datetime "doa"
    t.datetime "dob"
    t.datetime "dod"
    t.string   "updated_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "patients", ["facility", "site", "lastname"], name: "facility-site-lastname"
  add_index "patients", ["facility", "site"], name: "facility-site"
  add_index "patients", ["facility"], name: "index_patients_on_facility"
  add_index "patients", ["identifier"], name: "index_patients_on_identifier"
  add_index "patients", ["lastname"], name: "index_patients_on_lastname"
  add_index "patients", ["site"], name: "index_patients_on_site"

  create_table "products", force: :cascade do |t|
    t.string   "name"
    t.string   "description"
    t.integer  "price",       precision: 38
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "roles", force: :cascade do |t|
    t.string   "name"
    t.integer  "resource_id",   precision: 38
    t.string   "resource_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "roles", ["name", "resource_type", "resource_id"], name: "name_restype_res_id"
  add_index "roles", ["name"], name: "index_roles_on_name"

  create_table "users", force: :cascade do |t|
    t.string   "firstname"
    t.string   "lastname"
    t.string   "authen"
    t.string   "facility"
    t.string   "email"
    t.string   "firstinitial"
    t.string   "middleinitial"
    t.string   "updated_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["authen"], name: "index_users_on_authen"
  add_index "users", ["facility", "authen"], name: "facility-lastname"
  add_index "users", ["facility"], name: "index_users_on_facility"

  create_table "users_roles", id: false, force: :cascade do |t|
    t.integer "user_id", precision: 38
    t.integer "role_id", precision: 38
  end

  add_index "users_roles", ["user_id", "role_id"], name: "roles_userid_roleid"

end
