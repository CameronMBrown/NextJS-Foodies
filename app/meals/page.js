import { Suspense } from "react"
import Link from "next/link"

// assets
import classes from "./page.module.css"

// util
import { getMeals } from "@/lib/meals"

// components
import MealsGrid from "@/components/meals/meals-grid"

export const metadata = {
  title: "All Meals",
  description: "Browse the delicious meals shared by our vibrant community",
}

async function Meals() {
  const meals = await getMeals()

  return <MealsGrid meals={meals} />
}

function MealsPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious meals, created
          <span className={classes.highlight}> by you</span>
        </h1>
        <p>
          Choose your favourite recipe and cook it yourself. Its easy and fun to
          do
        </p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share your Favourite Recipe</Link>
        </p>
      </header>
      <main className={classes.main}>
        <Suspense
          fallback={<p className={classes.loading}>Fetching Meals...</p>}
        >
          <Meals />
        </Suspense>
      </main>
    </>
  )
}
export default MealsPage
