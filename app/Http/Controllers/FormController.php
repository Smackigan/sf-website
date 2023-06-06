<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use App\Mail\ContactFormMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Session;


class FormController extends Controller
{

    public function contactForm()
    {
        return view('contactform');
    }

    public function sendEmail(Request $request): RedirectResponse
{
    $validated = $request->validate([
        'name' => 'required',
        'email' => 'required|email',
        'phone' => 'required|integer|digits_between:7,15',
        'message' => 'required',
        'checkbox' => 'required|accepted',
    ], [
        'checkbox.required' => 'The chechbox should be ticked'
    ]);
 
    $input = $request->all();

    $contacts = Contact::create($input);

    $mail = new ContactFormMail($input);

    Mail::to('smack01@mail.ru')->send($mail);

    return redirect()->back()->with(['success' => 'Contact form Submitted!']);

    // dd($contacts);
    
}
}
