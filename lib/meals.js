import fs from 'node:fs'
import sql from 'better-sqlite3'
import slugify from 'slugify'
import xss from 'xss'

const db = sql('meals.db')

export async function getMeals() {
  return db.prepare('SELECT * FROM meals').all()
}

export function getMeal(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug)
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, {lower: true})
  // instructions are set as html in MealDetail component
  // therefore must protect against cross-site scripting with xxs
  meal.instructions = xss(meal.instructions)

  // prepare image name
  const extention = meal.image.name.split('.').pop()
  const fileName = `${meal.slug}.${extention}`

  // save image to /public
  const stream = fs.createWriteStream(`public/images/${fileName}`)
  const bufferedImage = await meal.image.arrayBuffer()
  stream.write(Buffer.from(bufferedImage), (err) => {
    if (err) {
      throw new Error('Error saving image')
    }
  })

  // overwrite image data, just save path to public location
  meal.image = `/images/${fileName}` 

  // save meal data to db
  db.prepare(`
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES 
    (@title, @summary, @instructions, @creator, @creator_email, @image, @slug)
  `).run(meal)
}