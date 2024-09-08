import Link from 'next/link';

export default function Home() {
    return (
        <div>
            <h1>Welcome to our app!</h1>
            <Link href="/login">
                Login
            </Link>
        </div>
    );
}
