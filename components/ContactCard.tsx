export default function ContactCard() {
  return (
	<div className="border-surface1 bg-base relative flex flex-col justify-between rounded-xl border p-4 shadow-lg lg:col-span-1">
      <h2 className="text-2xl font-bold mb-4 text-text">
        Contact Me
      </h2>
      <p className="text-text mb-4">
        Feel free to reach out to me via email or follow me on social media!
      </p>
      <ul className="space-y-2">
        <li>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:khasar.munkherdene@gmail.com"
            className="text-accent hover:underline"
          ><span>khasar.munkherdene@gmail.com</span></a>
        </li>
      </ul>
    </div>
  );
}
